const { getPrice } = require('./scraper.js');

async function test() {
    const urls = [
        "https://www.trendyol.com/apple/iphone-13-128-gb-yildiz-isigi-p-151121085",
        "https://www.hepsiburada.com/apple-iphone-13-128-gb-p-HBCV00000QU0Y3",
        "https://www.amazon.com.tr/dp/B09G96T6Y6",
        "https://www.n11.com/urun/apple-iphone-13-128-gb-apple-turkiye-garantili-2126284"
    ];

    for (const url of urls) {
        console.log(`\n--- Testing: ${url} ---`);
        try {
            const res = await getPrice(url);
            console.log("Result:", JSON.stringify(res, null, 2));
        } catch (err) {
            console.error("Error:", err.message);
        }
    }
}

test();
