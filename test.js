import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/serkan-web/', { waitUntil: 'networkidle' });
  await page.click('button:text("Hakkımda")');
  await page.waitForTimeout(2000);
  const tbl_height = await page.$eval('.about-toolkit-table', el => el.clientHeight).catch(e => "TBL_NOT_FOUND: " + e.message);
  console.log('TABLE HEIGHT:', tbl_height);
  const tbl_styles = await page.$eval('.about-toolkit-table', el => window.getComputedStyle(el).display).catch(e => "TBL_NOT_FOUND: " + e.message);
  console.log('TABLE DISPLAY:', tbl_styles);
  await browser.close();
})();
