require("dotenv").config();
const express = require("express");
const cron = require("node-cron");
const https = require("https");
const nodePath = require("path");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const { scrapeUrl, detectSite, supportedSites } = require("./scrapers/index");
const { analyze, reachedTarget } = require("./engine/analyzer");
const { groupProducts, findCheapestInGroup } = require("./engine/grouper");
const {
  buildPriceDropMessage,
  buildTargetReachedMessage,
  buildBackInStockMessage,
  buildAddedMessage,
  buildCheapestMessage,
} = require("./engine/notifier");
const {
  addProduct,
  getProducts,
  toggleProduct,
  updateProduct,
  deleteProduct,
  markNotified,
} = require("./db");

// Ortam Değişkenleri
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const JWT_SECRET = process.env.JWT_SECRET || "fiyat_botu_gizli_anahtar_2026";

const app = express();
app.use(express.json());
app.use(cors()); // Panel ile iletişim için
app.use(express.static(nodePath.join(__dirname, "panel/dist"))); // React Paneli Sun

// Middleware: Kimlik Doğrulama
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Yetkisiz erişim" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Geçersiz token" });
    req.user = user;
    next();
  });
};

// API: Login (JWT oluşturma)
app.post("/api/login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "24h" });
    return res.json({ token });
  }
  res.status(401).json({ message: "Hatalı şifre" });
});

// ─────────────────────────────────────────────
// TELEGRAM HELPER
// ─────────────────────────────────────────────
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

let telegramOffset = 0;
let telegramPolling = false;

async function sendTelegramMessage(chatId, text, parseMode = "HTML") {
  if (!TELEGRAM_TOKEN) {
    console.warn("⚠️ TELEGRAM_BOT_TOKEN .env'de yok!");
    return;
  }

  const body = JSON.stringify({
    chat_id: chatId,
    text,
    parse_mode: parseMode,
    disable_web_page_preview: false,
  });

  return new Promise((resolve) => {
    const options = {
      hostname: "api.telegram.org",
      path: `/bot${TELEGRAM_TOKEN}/sendMessage`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try { resolve(JSON.parse(data)); } catch { resolve(null); }
      });
    });
    req.on("error", (err) => {
      console.error("❌ Telegram gönderme hatası:", err.message);
      resolve(null);
    });
    req.write(body);
    req.end();
  });
}

async function getTelegramUpdates() {
  return new Promise((resolve) => {
    const path = `/bot${TELEGRAM_TOKEN}/getUpdates?offset=${telegramOffset}&timeout=30&allowed_updates=message`;
    const options = { hostname: "api.telegram.org", path, method: "GET" };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try { resolve(JSON.parse(data)); } catch { resolve({ ok: false, result: [] }); }
      });
    });
    req.on("error", () => resolve({ ok: false, result: [] }));
    req.setTimeout(35000, () => { req.destroy(); resolve({ ok: false, result: [] }); });
    req.end();
  });
}

// ─────────────────────────────────────────────
// URL GELİNCE — ÜRÜNÜ SCRAPE ET VE KAYDET
// ─────────────────────────────────────────────
async function handleProductUrl(chatId, url) {
  await sendTelegramMessage(chatId, "🔍 Ürün inceleniyor, lütfen bekleyin...");

  let site;
  try {
    site = detectSite(url);
  } catch {
    // bilinmiyor
  }

  if (!site || site === "unknown") {
    const supported = supportedSites().join(", ");
    await sendTelegramMessage(
      chatId,
      `❌ <b>Desteklenmeyen site!</b>\n\n` +
      `Desteklenen platformlar:\n${supportedSites().map((s) => `• ${s}`).join("\n")}\n\n` +
      `Lütfen bu sitelerden birinin bağlantısını gönderin.`
    );
    return;
  }

  try {
    const info = await scrapeUrl(url);

    if (!info.price) {
      await sendTelegramMessage(
        chatId,
        `❌ Fiyat çekilemedi!\n\nURL: ${url}\n\n` +
        `Ürün stokta olmayabilir veya site yapısı değişmiş olabilir.`
      );
      return;
    }

    const product = {
      id: Date.now().toString(),
      url,
      name: info.title,
      site: info.site,
      currentPrice: info.price,
      lastPrice: info.price,
      targetPrice: null,
      active: true,
      inStock: info.inStock,
      chatId: chatId.toString(),
      history: [{ price: info.price, date: new Date().toISOString() }],
      lastNotifiedPrice: null,
      lastNotifiedAt: null,
    };

    const saved = addProduct(product);

    // Eğer zaten vardı
    if (saved.id !== product.id) {
      await sendTelegramMessage(
        chatId,
        `ℹ️ Bu ürün zaten takip listende:\n📦 ${saved.name || "Ürün"}\n💰 ${(saved.currentPrice || 0).toLocaleString("tr-TR")} TL`
      );
      return;
    }

    await sendTelegramMessage(chatId, buildAddedMessage(product));
  } catch (err) {
    console.error("handleProductUrl hata:", err.message);
    await sendTelegramMessage(chatId, `❌ Hata oluştu: ${err.message}`);
  }
}

// ─────────────────────────────────────────────
// TELEGRAM KOMUTLARINI İŞLE
// ─────────────────────────────────────────────
async function handleTelegramMessage(msg) {
  const chatId = msg.chat.id;
  const text = (msg.text || "").trim();

  // URL gönderildi
  const urlMatch = text.match(/https?:\/\/[^\s]+/);
  if (urlMatch) {
    await handleProductUrl(chatId, urlMatch[0]);
    return;
  }

  // /liste
  if (text === "/liste" || text === "/list") {
    const products = getProducts().filter((p) => p.chatId === chatId.toString());
    if (products.length === 0) {
      await sendTelegramMessage(chatId, "📋 Takip ettiğiniz ürün yok.\n\nBir ürün URL'si göndererek başlayın!");
      return;
    }

    let reply = `📋 <b>Takip Listesi (${products.length} ürün)</b>\n\n`;
    for (const p of products) {
      const statusEmoji = p.active ? "🟢" : "🔴";
      const stockEmoji = p.inStock ? "✅" : "❌";
      reply +=
        `${statusEmoji} <b>${(p.name || "Ürün").substring(0, 40)}</b>\n` +
        `🏬 ${p.site || ""} | 💰 ${(p.currentPrice || 0).toLocaleString("tr-TR")} TL` +
        (p.targetPrice ? ` | 🎯 Hedef: ${p.targetPrice.toLocaleString("tr-TR")} TL` : "") +
        `\n${stockEmoji} Stok | 🆔 <code>${p.id}</code>\n\n`;
    }

    reply +=
      "Komutlar:\n" +
      "/durdur &lt;id&gt; - Takibi durdur\n" +
      "/baslat &lt;id&gt; - Takibi başlat\n" +
      "/sil &lt;id&gt; - Ürünü sil\n" +
      "/hedef &lt;id&gt; &lt;fiyat&gt; - Hedef fiyat belirle";

    await sendTelegramMessage(chatId, reply);
    return;
  }

  // /durdur <id>
  if (text.startsWith("/durdur ") || text.startsWith("/stop ")) {
    const id = text.split(" ")[1];
    const p = toggleProduct(id);
    if (p) await sendTelegramMessage(chatId, `🔴 Takip durduruldu: ${p.name || id}`);
    else await sendTelegramMessage(chatId, `❌ Ürün bulunamadı: ${id}`);
    return;
  }

  // /baslat <id>
  if (text.startsWith("/baslat ") || text.startsWith("/start ")) {
    const id = text.split(" ")[1];
    const p = toggleProduct(id);
    if (p) await sendTelegramMessage(chatId, `🟢 Takip başlatıldı: ${p.name || id}`);
    else await sendTelegramMessage(chatId, `❌ Ürün bulunamadı: ${id}`);
    return;
  }

  // /hedef <id> <fiyat>
  if (text.startsWith("/hedef ")) {
    const parts = text.split(" ");
    const id = parts[1];
    const target = parseFloat(parts[2]);
    if (!id || isNaN(target)) {
      await sendTelegramMessage(chatId, "❌ Kullanım: /hedef &lt;id&gt; &lt;fiyat&gt;\nÖrnek: /hedef 1234567890 500");
      return;
    }
    const p = updateProduct(id, { targetPrice: target });
    if (p) {
      await sendTelegramMessage(
        chatId,
        `🎯 Hedef fiyat belirlendi!\n📦 ${p.name || id}\n💰 Hedef: ${target.toLocaleString("tr-TR")} TL`
      );
    } else {
      await sendTelegramMessage(chatId, `❌ Ürün bulunamadı: ${id}`);
    }
    return;
  }

  // /sil <id>
  if (text.startsWith("/sil ")) {
    const id = text.split(" ")[1];
    const removed = deleteProduct(id);
    if (removed) await sendTelegramMessage(chatId, `🗑️ Ürün silindi: ${removed.name || id}`);
    else await sendTelegramMessage(chatId, `❌ Ürün bulunamadı: ${id}`);
    return;
  }

  // /yardim veya /start
  if (text === "/yardim" || text === "/help" || text === "/start") {
    const siteList = supportedSites().map((s) => `• ${s}`).join("\n");
    await sendTelegramMessage(
      chatId,
      `👋 <b>Fiyat Bot'a Hoş Geldiniz!</b>\n\n` +
      `Bu bot aşağıdaki platformları destekler:\n${siteList}\n\n` +
      `<b>Nasıl kullanılır?</b>\n` +
      `1. Ürün URL'sini direkt gönderin\n` +
      `2. Bot fiyatı kontrol eder ve takibe alır\n` +
      `3. Fiyat %10+ düşünce bildirim gönderilir\n\n` +
      `<b>Komutlar:</b>\n` +
      `/liste - Takip listeni gör\n` +
      `/hedef &lt;id&gt; &lt;fiyat&gt; - Hedef fiyat belirle\n` +
      `/durdur &lt;id&gt; - Takibi durdur\n` +
      `/baslat &lt;id&gt; - Takibi başlat\n` +
      `/sil &lt;id&gt; - Ürünü sil\n` +
      `/yardim - Bu mesajı göster`
    );
    return;
  }

  await sendTelegramMessage(chatId, "❓ Anlamadım.\n\nBir ürün URL'si gönderin veya /yardim yazın.");
}

// ─────────────────────────────────────────────
// TELEGRAM LONG POLLING
// ─────────────────────────────────────────────
async function startTelegramPolling() {
  if (!TELEGRAM_TOKEN) {
    console.warn("⚠️ TELEGRAM_BOT_TOKEN yok, polling başlamıyor!");
    return;
  }
  if (telegramPolling) return;
  telegramPolling = true;

  console.log("🤖 Telegram bot başlatılıyor...");

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/deleteWebhook?drop_pending_updates=true`);
    console.log("✅ Webhook temizlendi");
  } catch (e) {
    console.warn("⚠️ Webhook temizlenemedi:", e.message);
  }

  const poll = async () => {
    if (!telegramPolling) return;
    try {
      const data = await getTelegramUpdates();
      if (data.ok && data.result.length > 0) {
        for (const update of data.result) {
          telegramOffset = update.update_id + 1;
          if (update.message) {
            await handleTelegramMessage(update.message).catch((e) =>
              console.error("❌ Mesaj işleme hatası:", e.message)
            );
          }
        }
      }
    } catch (err) {
      if (!err.message?.includes("ETELEGRAM")) {
        console.error("❌ Polling hatası:", err.message);
      }
    }
    setTimeout(poll, 500);
  };

  poll();
}

// ─────────────────────────────────────────────
// SMART TIMING CRON JOBS
// ─────────────────────────────────────────────

// Her site için özel bir tarama fonksiyonu
const scrapeBySite = async (site) => {
  console.log(`⏱ [${site}] taraması başladı...`);
  const products = getProducts().filter(p => p.site === site && p.active);
  
  for (const p of products) {
    try {
      const info = await scrapeUrl(p.url);
      if (!info || !info.price) continue;

      const analysis = analyze(p, info.price);
      
      // DB Güncelle
      const history = p.history || [];
      history.push({ price: info.price, date: new Date().toISOString() });
      updateProduct(p.id, {
        currentPrice: info.price,
        inStock: info.inStock,
        history,
      });

      // Bildirim
      if (analysis.shouldNotify) {
        let msg = buildPriceDropMessage(p, info.price, analysis);
        if (reachedTarget(p, info.price)) msg += buildTargetReachedMessage(p, info.price);
        await sendTelegramMessage(p.chatId || TELEGRAM_CHAT_ID, msg);
        markNotified(p.id, info.price);
      }
    } catch (err) {
      console.error(`❌ [${site}] hatası (${p.name}):`, err.message);
    }
  }
  console.log(`✅ [${site}] taraması bitti.`);
};

// 1. Trendyol (Daha sık) - Her 5 Dakika
cron.schedule("*/5 * * * *", () => scrapeBySite("trendyol"));

// 2. Amazon - Her 10 Dakika
cron.schedule("*/10 * * * *", () => scrapeBySite("amazon"));

// 4. Günün En İyi 5 Fırsatı - Her Akşam 21:00
cron.schedule("0 21 * * *", async () => {
  const products = getProducts().filter(p => (p.history?.length > 1));
  const deals = products
    .map(p => {
      const oldPrice = p.history[0].price;
      const pct = ((oldPrice - p.currentPrice) / oldPrice) * 100;
      return { ...p, pct };
    })
    .filter(p => p.pct > 0)
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5);

  if (deals.length > 0) {
    let msg = "🏆 <b>GÜNÜN EN İYİ 5 FIRSATI</b>\n\n";
    deals.forEach((d, i) => {
      msg += `${i+1}. 📦 ${d.name}\n💰 <b>${d.currentPrice} TL</b> (%${d.pct.toFixed(1)} İndirim)\n🔗 <a href='${d.url}'>Ürüne Git</a>\n\n`;
    });
    await sendTelegramMessage(TELEGRAM_CHAT_ID, msg);
  }
});

// ─────────────────────────────────────────────
// PANEL API (Korumalı)
// ─────────────────────────�// Ürün sil
app.delete("/api/products/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const success = deleteProduct(id);
  if (success) return res.json({ message: "Ürün silindi" });
  res.status(404).json({ message: "Ürün bulunamadı" });
});

// ─────────────────────────────────────────────
// SPA FALLBACK
// ─────────────────────────────────────────────
app.get("*", (req, res) => {
  const file = nodePath.join(__dirname, "panel", "dist", "index.html");
  res.sendFile(file, (err) => {
    if (err) {
      console.error("❌ Panel sunma hatası:", err.message);
      res.status(500).send("Panel bulunamadı veya sunulamadı.");
    }
  });
});

// ─────────────────────────────────────────────
// BAŞLAT
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server çalışıyor: http://localhost:${PORT}`);
  console.log("📡 Bot ve Panel aktif!");
  startTelegramPolling();
});

process.on("unhandledRejection", (reason) => console.error("⚠️ Unhandled Rejection:", reason));
process.on("uncaughtException", (err) => console.error("💀 Uncaught Exception:", err.message));
   res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: "Ürün eklenemedi: " + err.message });
  }
});

// Ürün sil
app.delete("/api/products/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const success = deleteProduct(id);
  if (success) return res.json({ message: "Ürün silindi" });
  res.status(404).json({ message: "Ürün bulunamadı" });
});

// ─────────────────────────────────────────────
// FRONTEND SERVING (SPA Fallback)
// ─────────────────────────────────────────────
app.get("*", (req, res) => {
  try {
    const fullPath = nodePath.join(__dirname, "panel", "dist", "index.html");
    res.sendFile(fullPath);
  } catch (err) {
    console.error("❌ Panel sunma hatası:", err.message);
    res.status(500).send("Sunucu hatası: Panel yüklenemedi.");
  }
});

// ─────────────────────────────────────────────
// BAŞLAT
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server çalışıyor: http://localhost:${PORT}`);
  console.log(`📡 Desteklenen siteler: ${supportedSites().join(", ")}`);
  startTelegramPolling();
});

process.on("unhandledRejection", (reason) => console.error("⚠️ Unhandled Rejection:", reason));
process.on("uncaughtException", (err) => console.error("💀 Uncaught Exception:", err.message));