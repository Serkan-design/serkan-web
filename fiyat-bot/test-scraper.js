const { getPrice } = require('./scraper.js');

(async () => {
  try {
    console.log("Starting test...");
    const url = "https://www.trendyol.com/the-base/baggy-kot-pantolon-gri-p-804169733";
    const res = await getPrice(url);
    console.log("Result:", res);
  } catch (err) {
    console.error("Error occurred:", err);
  }
})();
