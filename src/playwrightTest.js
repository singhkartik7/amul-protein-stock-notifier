const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false
  });

  const page = await browser.newPage();

 page.on('response', async (response) => {
  const url = response.url();

  if (url.includes('ms.products')) {

    try {
      const data = await response.json();

      console.log("\nSTATUS:", response.status());
      console.log("PRODUCTS:", data.data?.length);

      if (data.data?.length > 0) {
        data.data.forEach(product => {
          console.log(
            product.name,
            "Inventory:",
            product.inventory_quantity
          );
        });
      }

    } catch (err) {
      console.log(err.message);
    }
  }
});

  await page.goto(
    "https://shop.amul.com/en/browse/protein",
    { waitUntil: "networkidle" }
  );

})();