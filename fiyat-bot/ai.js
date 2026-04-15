require("dotenv").config();

async function extractPriceAI(html) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Bu HTML içindeki ürün fiyatını bul ve sadece sayı olarak dön (nokta ile, örnek: 1299.90):\n${html.slice(0, 12000)}`
        }
      ]
    })
  });

  const data = await res.json();

  try {
    const text = data.choices[0].message.content;
    return parseFloat(text);
  } catch {
    return null;
  }
}

module.exports = { extractPriceAI };
