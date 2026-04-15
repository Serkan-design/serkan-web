const axios = require("axios");
const cheerio = require("cheerio");

/**
 * Akıllı fiyat parse — Türkçe/İngiliz format destekli
 * "1.234,56 TL" → 1234.56
 * "1,234.56"   → 1234.56
 * "100022.729" → null (saçma değer)
 */
function parsePrice(raw) {
  if (!raw) return null;
  const str = String(raw).trim().replace(/\s/g, "");
  const cleaned = str.replace(/[^\d.,]/g, "");
  if (!cleaned) return null;

  let value;

  // Türkçe: "1.234,56" veya "1.234"
  if (/^\d{1,3}(\.\d{3})*(,\d{1,2})?$/.test(cleaned)) {
    value = parseFloat(cleaned.replace(/\./g, "").replace(",", "."));
  }
  // İngiliz: "1,234.56"
  else if (/^\d{1,3}(,\d{3})*(\.\d{1,2})?$/.test(cleaned)) {
    value = parseFloat(cleaned.replace(/,/g, ""));
  }
  // "1234,56"
  else if (/^\d+,\d{1,2}$/.test(cleaned)) {
    value = parseFloat(cleaned.replace(",", "."));
  }
  // "1234.56" — 3 ondalık varsa Türkçe binlik (1.234 = 1234)
  else if (/^\d+\.\d+$/.test(cleaned)) {
    const parts = cleaned.split(".");
    value = parts[1].length === 3
      ? parseFloat(parts[0] + parts[1])
      : parseFloat(cleaned);
  }
  else {
    value = parseFloat(cleaned.replace(/[^\d.]/g, ""));
  }

  if (isNaN(value) || value < 1 || value > 500000) return null;
  return value;
}

/** HTTP isteği — kısa link redirect'lerini takip eder */
async function fetchHtml(url) {
  const { data, request } = await axios.get(url, {
    timeout: 20000,
    maxRedirects: 10,  // ty.gl → trendyol.com gibi redirect'leri takip et
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
      "Accept-Encoding": "gzip, deflate, br",
      "Cache-Control": "no-cache",
    },
  });
  // Redirect sonrası gerçek URL
  const finalUrl = request?.res?.responseUrl || url;
  return { html: data, finalUrl };
}

/** Trendyol — __NEXT_DATA__ JSON'dan fiyat çek */
function scrapeTrendyol(html) {
  try {
    const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (match) {
      const json = JSON.parse(match[1]);
      const str = JSON.stringify(json);

      // Ürün objesi
      const product =
        json?.props?.pageProps?.product ||
        json?.props?.pageProps?.initialState?.productDetail?.product;

      if (product) {
        const rawPrice =
          product?.price?.sellingPrice ||
          product?.price?.discountedPrice ||
          product?.price?.originalPrice;

        const price = typeof rawPrice === "number" && rawPrice > 0 && rawPrice < 500000
          ? rawPrice : null;

        const title = product?.name || null;
        const inStock = product?.inStock ?? true;

        if (price) return { price, title, inStock };
      }

      // Fallback: JSON string içinde ara
      const m = str.match(/"sellingPrice"\s*:\s*([\d.]+)/);
      if (m) {
        const v = parseFloat(m[1]);
        if (v > 0 && v < 500000) {
          const t = str.match(/"name"\s*:\s*"([^"]{5,120})"/);
          const s = str.match(/"inStock"\s*:\s*(true|false)/);
          return {
            price: v,
            title: t ? t[1] : "Bilinmiyor",
            inStock: s ? s[1] === "true" : true
          };
        }
      }
    }
  } catch (e) {}
  return null;
}

/** Hepsiburada — JSON-LD ve meta taglardan */
function scrapeHepsiburada($, html) {
  // JSON-LD dene
  try {
    const scripts = $('script[type="application/ld+json"]').toArray();
    for (const el of scripts) {
      const json = JSON.parse($(el).html());
      const item = Array.isArray(json) ? json[0] : json;
      if (item?.offers?.price) {
        return {
          price: parsePrice(String(item.offers.price)),
          title: item.name || "Bilinmiyor",
          inStock: item.offers?.availability?.includes("InStock") ?? true
        };
      }
    }
  } catch (e) {}

  // HTML içinde fiyat pattern ara
  const m = html.match(/"price"\s*:\s*"?([\d.,]+)"?/);
  if (m) {
    const price = parsePrice(m[1]);
    if (price) return { price, title: $("h1").first().text().trim() || "Bilinmiyor", inStock: true };
  }

  return null;
}

/** N11 — JSON-LD */
function scrapeN11($) {
  try {
    const scripts = $('script[type="application/ld+json"]').toArray();
    for (const el of scripts) {
      const json = JSON.parse($(el).html());
      const item = Array.isArray(json) ? json[0] : json;
      if (item?.offers) {
        const offers = Array.isArray(item.offers) ? item.offers[0] : item.offers;
        const price = parsePrice(String(offers?.price || ""));
        return {
          price,
          title: item.name || "Bilinmiyor",
          inStock: offers?.availability?.includes("InStock") ?? true
        };
      }
    }
  } catch (e) {}
  return null;
}

/** Dolap — HTML parse */
function scrapeDolap($) {
  const priceEl = $("[class*='price']").first();
  const price = parsePrice(priceEl.text());
  return {
    price,
    title: $("h1").first().text().trim() || "Bilinmiyor",
    inStock: true
  };
}

/** Genel fallback — meta tags ve JSON-LD */
function scrapeGeneric($, html) {
  // Meta itemprop
  const metaPrice = $("meta[itemprop='price']").attr("content");
  if (metaPrice) {
    const price = parsePrice(metaPrice);
    if (price) {
      return {
        price,
        title: $("h1").first().text().trim() || "Bilinmiyor",
        inStock: true
      };
    }
  }

  // JSON-LD
  try {
    const scripts = $('script[type="application/ld+json"]').toArray();
    for (const el of scripts) {
      const json = JSON.parse($(el).html());
      const item = Array.isArray(json) ? json[0] : json;
      if (item?.offers) {
        const offers = Array.isArray(item.offers) ? item.offers[0] : item.offers;
        const price = parsePrice(String(offers?.price || ""));
        if (price) return {
          price,
          title: item.name || $("h1").first().text().trim() || "Bilinmiyor",
          inStock: offers?.availability?.includes("InStock") ?? true
        };
      }
    }
  } catch (e) {}

  return null;
}

/** Ana fonksiyon */
async function getPrice(url) {
  try {
    console.log(`🌐 Çekiliyor: ${url}`);
    const { html, finalUrl } = await fetchHtml(url);
    const $ = cheerio.load(html);

    console.log(`🔀 Final URL: ${finalUrl}`);

    let result = null;

    if (finalUrl.includes("trendyol.com") || url.includes("trendyol.com") || url.includes("ty.gl")) {
      result = scrapeTrendyol(html);
    } else if (finalUrl.includes("hepsiburada.com")) {
      result = scrapeHepsiburada($, html);
    } else if (finalUrl.includes("n11.com")) {
      result = scrapeN11($);
    } else if (finalUrl.includes("dolap.com")) {
      result = scrapeDolap($);
    }

    // Hepsi başarısız → genel fallback
    if (!result || !result.price) {
      console.log("⚠️ Platform-specific başarısız, genel fallback deneniyor...");
      result = scrapeGeneric($, html);
    }

    if (!result || !result.price) {
      console.warn("❌ Fiyat bulunamadı:", finalUrl);
      return { price: null, title: $("h1").first().text().trim() || "Bilinmiyor", inStock: false };
    }

    // Başlık trim
    result.title = (result.title || "Bilinmiyor").trim().slice(0, 80);

    console.log(`✅ Sonuç: ${result.price} TL | ${result.title.slice(0, 30)} | Stok: ${result.inStock}`);
    return result;

  } catch (err) {
    console.error("❌ SCRAPER HATA:", err.message);
    return { price: null, title: "Bilinmiyor", inStock: false };
  }
}

module.exports = { getPrice, parsePrice };
