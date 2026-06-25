require("dotenv").config();

const fs = require("fs");
const config = JSON.parse(
 fs.readFileSync(
  "config/config.json",
  "utf8"
)
);

const { chromium } = require("playwright");

const { sendNotification } = require("./telegram");

const targets = JSON.parse(
  fs.readFileSync("data/products.json", "utf8")
);
let previousStock = {};
let isRunning = false;

if (fs.existsSync("data/stock.json")) {
  previousStock = JSON.parse(
    fs.readFileSync("data/stock.json", "utf8")
  );
}

async function checkStock() {
   if (isRunning) {
    console.log("Previous check still running...");
    return;
  }

  isRunning = true;

  const browser = await chromium.launch({
    headless: config.headless
  });

  const page = await browser.newPage();
  let productsFound = 0;

  page.on("response", async (response) => {

    if (
      response.url().includes("ms.products") &&
      response.status() === 200
    ) {

      try {

        const data = await response.json();

        if (!data.data) return;

        for (const product of data.data) {

          if (targets.includes(product.name)) {
            productsFound++;

            console.log(
  product.name,
  "Inventory:",
  product.inventory_quantity
);

const currentStock = product.inventory_quantity;

const previous =
  previousStock[product.name] || 0;

if (
  currentStock > 0 &&
  currentStock !== previous
){
await sendNotification(
  process.env.CHAT_ID,
  product.name,
  currentStock
);

  console.log("Notification Sent");

}

previousStock[product.name] =
  currentStock;

          }

        }
        fs.writeFileSync(
  "data/stock.json",
  JSON.stringify(previousStock, null, 2)
);

console.log("Stock file updated");

      } catch (err) {
        console.log(err.message);
      }

    }

  });

 await page.goto(
  "https://shop.amul.com/en/browse/protein",
  {
    waitUntil: "domcontentloaded",
    timeout: 60000
  }
);
await page.fill("#search", config.pincode);

console.log("Pincode entered");

// Wait for the suggestion to appear
await page.waitForSelector("a.searchitem-name", {
  timeout: 10000
});

console.log("Suggestion appeared");

// Click the suggestion
await page.click("a.searchitem-name");

const response = await page.waitForResponse(
  response =>
    response.url().includes("ms.products") &&
    response.status() === 200,
  { timeout: 15000 }
);

console.log("Products API received");

const data = await response.json();


console.log(`Products Found: ${productsFound}`);

await browser.close();
isRunning = false;

}

checkStock();
setInterval(() => {

  console.log(
    "\n================================="
  );
  console.log(
    "Checking stock:",
    new Date().toLocaleString()
  );
  console.log(
    "=================================\n"
  );

  checkStock();

},  30 * 1000);
