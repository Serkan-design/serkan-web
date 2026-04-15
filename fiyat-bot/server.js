const express = require("express");
const pathLib = require("path");
const cron = require("node-cron");
const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const { getPrice } = require("./scraper");
const { addProduct, getProducts, toggleProduct, updateProduct } = require("./db");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const token = process.env.TELEGRAM_BOT_TOKEN;
const defaultChatId = process.env.TELEGRAM_CHAT_ID;

if (!token) {
  console.error("❌ .env dosyasında TELEGRAM_BOT_TOKEN eksik!");
  process.exit(1);
}

// ─────────────────────────────────────────────────────
// 409 Conflict FIX:
// Bot başlamadan önce webhook'u sil ve bekleyen
// güncellemeleri temizle. Bu sayede eski instance'lar
// bir daha getUpdates isteği atamaz.
// ─────────────────────────────────────────────────────
async function clearWebhookAndStart() {
  try {
    // Önce webhook'u sil (eski instance varsa devre dışı kals)
    const res = await fetch(
      `https://api.telegram.org/bot${token}/deleteWebhook?drop_pending_updates=true`
    );
    const data = await res.json();
    if (data.ok) {
      console.log("✅ Webhook temizlendi, eski botlar devre dışı");
    }
  } catch (e) {
    console.warn("⚠️ Webhook temizlenemedi:", e.message);
  }

  // Şimdi polling başlat
  const bot = new TelegramBot(token, {
    polling: {
      interval: 1000,     // 1s polling aralığı
      autoStart: true,
      params: { timeout: 10 }
    }
  });

  console.log("🤖 Telegram Bot Aktif");
  setupBot(bot);
}

// ─────────────────────────────────────────────────────
// BOT KOMUTLARI
// ─────────────────────────────────────────────────────
function setupBot(bot) {

  // Fiyatı düzgün biçimlendir
  function formatPrice(p) {
    if (p === null || p === undefined) return "Bilinmiyor";
    // Sayıyı Türkçe formatla: 1234.5 → "1.234,50 TL"
    return Number(p).toLocaleString("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + " TL";
  }

  // URL alındığında ürünü takibe al
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id.toString();
    const text = (msg.text || "").trim();

    if (!text) return;

    // ─── URL GELDİ ───
    const urlMatch = text.match(/(https?:\/\/[^\s]+)/);
    if (urlMatch) {
      const url = urlMatch[1].trim();

      // Platform kontrolü - ty.gl Trendyol kısa linki, desteklenir
      // Bilinmeyen platformlar için de dene, sadece uyarı ver
      const knownUnsupported = ["instagram.com", "facebook.com", "youtube.com", "twitter.com"];
      if (knownUnsupported.some(s => url.includes(s))) {
        bot.sendMessage(chatId, "❌ Bu platform desteklenmiyor (sosyal medya linki).");
        return;
      }

      bot.sendMessage(chatId, "🔍 Ürün inceleniyor, lütfen bekleyin...");

      try {
        const data = await getPrice(url);

        if (!data || (!data.price && !data.inStock)) {
          bot.sendMessage(chatId, "❌ Fiyat ve stok bilgisi alınamadı. URL geçerli mi?");
          return;
        }

        const stockText = data.inStock ? "✅ Stokta var" : "❌ STOKTA YOK";
        const priceText = data.price ? formatPrice(data.price) : "Belirtilmemiş";
        const name = (data.title || "Bilinmiyor").slice(0, 60);

        bot.sendMessage(chatId,
          `✅ Ürün takibe alındı!\n\n` +
          `📦 ${name}\n` +
          `💰 Güncel Fiyat: ${priceText}\n` +
          `${stockText}\n` +
          `🔗 ${url}\n\n` +
          `📊 Her 5 dakikada otomatik kontrol edilecek.`
        );

        // Ürünü kaydet
        const existing = getProducts().find(p => p.url === url && p.chatId === chatId && p.active);
        if (!existing) {
          addProduct({
            id: Date.now().toString(),
            name: data.title || "Yeni Ürün",
            url,
            chatId,
            currentPrice: data.price,
            lastPrice: data.price,
            initialPrice: data.price,
            targetPrice: null,
            inStock: data.inStock,
            active: true,
            lastChecked: new Date().toISOString(),
            history: [{ price: data.price, date: new Date().toISOString() }]
          });
        } else {
          bot.sendMessage(chatId, "ℹ️ Bu ürün zaten takip listende.");
        }

      } catch (err) {
        console.error("❌ URL işleme hatası:", err.message);
        bot.sendMessage(chatId, "❌ Bir hata oluştu: " + err.message);
      }

      return;
    }

    // ─── /status veya /liste ───
    if (text === "/status" || text === "/liste") {
      const products = getProducts().filter(p => p.chatId === chatId);
      if (products.length === 0) {
        bot.sendMessage(chatId, "📋 Takip listende ürün yok.\n\nBir ürün URL'si gönder!");
        return;
      }

      let msgStr = `📋 Takipteki Ürünler (${products.length}):\n\n`;
      products.forEach((p, i) => {
        const current = p.inStock
          ? (p.currentPrice ? formatPrice(p.currentPrice) : "Fiyat yok")
          : "STOKTA YOK";
        const initial = p.initialPrice ? formatPrice(p.initialPrice) : "Bilinmiyor";
        const status = p.active ? "🟢" : "🔴";
        msgStr += `${i + 1}. ${status} ${(p.name || "Ürün").slice(0, 35)}\n`;
        msgStr += `   💰 İlk: ${initial} | Şu an: ${current}\n`;
        msgStr += `   🆔 ${p.id}\n\n`;
      });
      msgStr += "Komutlar:\n/sil <id> | /durdur <id> | /hedef <id> <fiyat> | /sifirla";
      bot.sendMessage(chatId, msgStr);
      return;
    }

    // ─── /sil <id> ───
    if (text.startsWith("/sil ")) {
      const id = text.split(" ")[1];
      const p = updateProduct(id, { active: false });
      if (p) {
        bot.sendMessage(chatId, `🗑️ Takipten çıkarıldı: ${p.name || id}`);
      } else {
        bot.sendMessage(chatId, `❌ Ürün bulunamadı: ${id}`);
      }
      return;
    }

    // ─── /durdur <id> ───
    if (text.startsWith("/durdur ")) {
      const id = text.split(" ")[1];
      const p = toggleProduct(id);
      if (p) {
        bot.sendMessage(chatId, p.active ? `▶️ Takip başlatıldı: ${p.name}` : `⏸ Takip durduruldu: ${p.name}`);
      } else {
        bot.sendMessage(chatId, `❌ Ürün bulunamadı: ${id}`);
      }
      return;
    }

    // ─── /hedef <id> <fiyat> ───
    if (text.startsWith("/hedef ")) {
      const parts = text.split(" ");
      const id = parts[1];
      const target = parseFloat(parts[2]);
      if (!id || isNaN(target)) {
        bot.sendMessage(chatId, "❌ Kullanım: /hedef <id> <fiyat>\nÖrnek: /hedef 1712345678 1500");
        return;
      }
      const p = updateProduct(id, { targetPrice: target });
      if (p) {
        bot.sendMessage(chatId, `🎯 Hedef fiyat: ${target.toLocaleString("tr-TR")} TL\n📦 ${p.name}`);
      } else {
        bot.sendMessage(chatId, `❌ Ürün bulunamadı: ${id}`);
      }
      return;
    }

    // ─── /sifirla ───
    if (text === "/sifirla") {
      const products = getProducts().filter(p => p.chatId === chatId);
      if (products.length === 0) {
        bot.sendMessage(chatId, "📋 Listede zaten ürün yok.");
        return;
      }
      bot.sendMessage(chatId,
        `⚠️ Tüm ${products.length} ürünü silmek istediğine emin misin?\n\n` +
        `Onaylamak için: /sifirla-onayla\n` +
        `İptal için: başka bir şey yaz`
      );
      return;
    }

    if (text === "/sifirla-onayla") {
      const { writeDB } = require("./db");
      const tumUrunler = getProducts();
      // Sadece bu chat'e ait olanları sil, diğerlerini koru
      const kalanlar = tumUrunler.filter(p => p.chatId !== chatId);
      writeDB(kalanlar);
      const silinenSayi = tumUrunler.length - kalanlar.length;
      bot.sendMessage(chatId, `✅ ${silinenSayi} ürün silindi. Liste temizlendi!`);
      return;
    }

    // ─── /start veya /yardim ───
    if (text === "/start" || text === "/yardim" || text === "/help") {
      bot.sendMessage(chatId,
        `👋 Fiyat Bot'a Hoş Geldiniz!\n\n` +
        `Desteklenen platformlar:\n` +
        `• Trendyol  • Hepsiburada\n` +
        `• N11  • Dolap  • Amazon\n\n` +
        `Kullanım:\n` +
        `1️⃣ Ürün URL'sini gönder\n` +
        `2️⃣ Bot fiyatı çeker, 5dk'da bir kontrol eder\n` +
        `3️⃣ Fiyat düşünce sana haber verir\n\n` +
        `Komutlar:\n` +
        `/liste — Takip listeni gör\n` +
        `/hedef <id> <fiyat> — Hedef fiyat belirle\n` +
        `/durdur <id> — Takibi durdur/başlat\n` +
        `/sil <id> — Ürünü listeden sil\n` +
        `/sifirla — Tüm listeyi temizle`
      );
      return;
    }

    bot.sendMessage(chatId, "❓ Anlamadım. Bir URL gönderin veya /yardim yazın.");
  });

  // Polling hatalarını yakala ama çökme
  bot.on("polling_error", (err) => {
    // 409: başka bir instance zaten çalışıyor (nadiren olabilir, loglama yeter)
    if (err.code === "ETELEGRAM" && err.message?.includes("409")) {
      console.error("⚠️ 409 Conflict: Sunucuda başka bir bot instance var! 'pkill -f server.js' ile diğer instance'ı kapat.");
    } else {
      console.error("❌ Polling hatası:", err.message);
    }
  });

  // ─── OTOMATİK FİYAT KONTROL (her 5 dakika) ───
  cron.schedule("*/5 * * * *", async () => {
    console.log(`⏱ [${new Date().toLocaleTimeString()}] Fiyatlar kontrol ediliyor...`);

    const products = getProducts().filter(p => p.active);

    for (const p of products) {
      try {
        const data = await getPrice(p.url);
        if (!data) continue;

        const chatId = p.chatId || defaultChatId;
        if (!chatId) continue;

        // Stok geldi bildirimi
        if (data.inStock && !p.inStock) {
          console.log("🔥 ÜRÜN GELDİ:", p.name);
          bot.sendMessage(chatId,
            `🔥 ÜRÜN GELDİ!\n📦 ${p.name}\n💰 Fiyat: ${data.price ? data.price.toLocaleString("tr-TR") + " TL" : "Bilinmiyor"}\n🔗 ${p.url}`
          );
        }

        // Fiyat düştü bildirimi
        if (data.price && p.currentPrice && data.price < p.currentPrice) {
          const diff = (p.currentPrice - data.price).toFixed(2);
          const pct = ((p.currentPrice - data.price) / p.currentPrice * 100).toFixed(1);

          console.log(`📉 FİYAT DÜŞTÜ: [${p.name}] ${p.currentPrice} → ${data.price} TL`);

          let msg = `📉 FİYAT DÜŞTÜ!\n\n`;
          msg += `📦 ${p.name}\n`;
          msg += `💸 Eski: ${p.currentPrice.toLocaleString("tr-TR")} TL\n`;
          msg += `✅ Yeni: ${data.price.toLocaleString("tr-TR")} TL\n`;
          msg += `🔥 İndirim: ${Number(diff).toLocaleString("tr-TR")} TL (%${pct})\n`;
          msg += `🔗 ${p.url}`;

          if (p.targetPrice && data.price <= p.targetPrice) {
            msg += `\n\n🎯 HEDEF FİYATA ULAŞILDI! Hemen satın al!`;
          }

          bot.sendMessage(chatId, msg);
        }

        // Ürünü güncelle
        updateProduct(p.id, {
          inStock: data.inStock,
          lastPrice: p.currentPrice,
          currentPrice: data.price ?? p.currentPrice,
          lastChecked: new Date().toISOString(),
          history: [...(p.history || []), { price: data.price, date: new Date().toISOString() }]
        });

      } catch (err) {
        console.error(`❌ Cron hatası [${p.name}]:`, err.message);
      }
    }

    console.log("✅ Kontrol tamamlandı");
  });
}

// ─────────────────────────────────────────────────────
// EXPRESS API
// ─────────────────────────────────────────────────────
app.get("/", (req, res) => res.json({ status: "ok" }));
app.get("/products", (req, res) => res.json(getProducts()));

// Admin Giriş (Panel için)
app.post("/api/login", (req, res) => {
  const { password } = req.body;
  const adminPass = process.env.ADMIN_PASSWORD || "admin123"; // Varsayılan şifre
  
  if (password === adminPass) {
    // Basit bir token simülasyonu
    return res.json({ success: true, token: "mock-jwt-token-" + Date.now() });
  }
  res.status(401).json({ success: false, message: "Hatalı şifre!" });
});

app.use((req, res, next) => {
  if (!req.path.startsWith("/api") && !req.path.includes(".")) {
    req.url = "/index.html";
  }
  next();
});

app.use(express.static(pathLib.join(__dirname, "panel/dist")));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Sunucu Çalışıyor: http://localhost:${PORT}`);
});

// Webhook temizle sonra başlat
clearWebhookAndStart().then(() => {
  // ─────────────────────────────────────────────────────
  // BAŞLAMA BİLDİRİMİ
  // ─────────────────────────────────────────────────────
  const os = require("os");

  function getMbUsed() {
    return Math.round(process.memoryUsage().rss / 1024 / 1024);
  }

  function getCpuLoad() {
    const load = os.loadavg(); // [1dk, 5dk, 15dk]
    const cores = os.cpus().length;
    return {
      load1: (load[0] / cores * 100).toFixed(1),
      load5: (load[1] / cores * 100).toFixed(1),
    };
  }

  function sendAlert(msg) {
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!chatId || !token) return;

    const https = require("https");
    const body = JSON.stringify({ chat_id: chatId, text: msg, parse_mode: "HTML" });
    const req = https.request({
      hostname: "api.telegram.org",
      path: `/bot${token}/sendMessage`,
      method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) }
    });
    req.on("error", () => {});
    req.write(body);
    req.end();
  }

  // Bot başladı bildirimi
  const cpu = getCpuLoad();
  sendAlert(
    `🚀 <b>Fiyat Bot Başlatıldı</b>\n\n` +
    `🕐 ${new Date().toLocaleString("tr-TR")}\n` +
    `💾 RAM: ${getMbUsed()} MB\n` +
    `⚙️ CPU Yük: %${cpu.load1} (1dk) / %${cpu.load5} (5dk)\n` +
    `📋 Takip: ${getProducts().filter(p => p.active).length} ürün`
  );

  // ─────────────────────────────────────────────────────
  // RAM / CPU MONİTOR (her 10 dakika)
  // ─────────────────────────────────────────────────────
  const RAM_LIMIT_MB = 400;   // 400 MB üstü uyarı
  const CPU_LIMIT_PCT = 85;   // %85 üstü uyarı

  let lastRamAlert = 0;
  let lastCpuAlert = 0;
  const ALERT_COOLDOWN = 30 * 60 * 1000; // aynı uyarıyı 30dk'da bir at

  setInterval(() => {
    const now = Date.now();
    const ramMb = getMbUsed();
    const cpu = getCpuLoad();
    const cpuPct = parseFloat(cpu.load1);

    // RAM aşımı
    if (ramMb > RAM_LIMIT_MB && now - lastRamAlert > ALERT_COOLDOWN) {
      lastRamAlert = now;
      sendAlert(
        `⚠️ <b>Yüksek RAM Kullanımı!</b>\n\n` +
        `💾 RAM: ${ramMb} MB (limit: ${RAM_LIMIT_MB} MB)\n` +
        `🕐 ${new Date().toLocaleString("tr-TR")}`
      );
    }

    // CPU aşımı
    if (cpuPct > CPU_LIMIT_PCT && now - lastCpuAlert > ALERT_COOLDOWN) {
      lastCpuAlert = now;
      sendAlert(
        `🔥 <b>Yüksek CPU Kullanımı!</b>\n\n` +
        `⚙️ CPU Yük: %${cpu.load1} (1dk) / %${cpu.load5} (5dk)\n` +
        `💾 RAM: ${ramMb} MB\n` +
        `🕐 ${new Date().toLocaleString("tr-TR")}`
      );
    }
  }, 10 * 60 * 1000); // her 10 dakika

  // ─────────────────────────────────────────────────────
  // ÇÖKME BİLDİRİMİ
  // ─────────────────────────────────────────────────────
  process.on("uncaughtException", (err) => {
    console.error("💀 Uncaught Exception:", err.message);
    sendAlert(
      `💀 <b>BOT ÇÖKTÜ!</b>\n\n` +
      `❌ Hata: ${err.message}\n` +
      `📁 ${err.stack?.split("\n")[1]?.trim() || ""}\n` +
      `🕐 ${new Date().toLocaleString("tr-TR")}\n\n` +
      `⏳ PM2 otomatik yeniden başlatıyor...`
    );
    setTimeout(() => process.exit(1), 2000); // mesajın gitmesi için bekle
  });

  process.on("unhandledRejection", (reason) => {
    console.error("⚠️ Unhandled Rejection:", reason);
    sendAlert(
      `⚠️ <b>İşlenmeyen Hata (Rejection)</b>\n\n` +
      `❌ ${String(reason).slice(0, 200)}\n` +
      `🕐 ${new Date().toLocaleString("tr-TR")}`
    );
  });

  process.on("SIGTERM", () => {
    sendAlert(`🔄 <b>Bot yeniden başlatılıyor...</b>\n🕐 ${new Date().toLocaleString("tr-TR")}`);
    setTimeout(() => process.exit(0), 1500);
  });
});
