const { chromium } = require("playwright");

(async () => {

  const browser = await chromium.launch({
    headless: false
  });

  const page = await browser.newPage();

  await page.addInitScript(() => {
    localStorage.setItem("pincode", "302017");
    localStorage.setItem("substore", "rajasthan");
  });

  await page.goto(
  "https://shop.amul.com/en/browse/protein"
);

await page.waitForTimeout(3000);

// Click the search box first
await page.click("#search");

await page.waitForTimeout(1000);

// Type like a real user
await page.keyboard.type("302017", { delay: 100 });

await page.waitForTimeout(3000);

// Try selecting suggestion
await page.keyboard.press("Enter");
await page.waitForTimeout(1000);

await page.keyboard.press("Enter");
await page.waitForTimeout(1000);

await page.keyboard.press("Enter");

await page.waitForTimeout(15000);

})();