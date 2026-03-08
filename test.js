import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ 
    viewport: { width: 1400, height: 1000 }
  });
  await page.goto('http://localhost:5173/serkan-web/', { waitUntil: 'networkidle' });
  await page.click('button:text("Hakkımda")');
  await page.waitForTimeout(2000);
  
  // scroll down the right panel
  await page.evaluate(() => {
    const rightPanel = document.querySelector('.about-page-right');
    if (rightPanel) rightPanel.scrollTop = rightPanel.scrollHeight;
  });
  
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'C:/Users/ASUS/.gemini/antigravity/brain/7e1dd767-ee05-4a4a-b5de-c6fc5ae93c6f/final_about_page_view.png' });
  await browser.close();
})();
