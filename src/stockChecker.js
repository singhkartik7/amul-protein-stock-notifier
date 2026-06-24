require("dotenv").config();
const fs = require("fs");
const TelegramBot = require("node-telegram-bot-api");
const { chromium } = require("playwright");

const bot = new TelegramBot(process.env.BOT_TOKEN);

const targets = [
  "Amul High Protein Milk, 250 mL | Pack of 32"
];
let previousStock = {};

if (fs.existsSync("stock.json")) {
  previousStock = JSON.parse(
    fs.readFileSync("stock.json", "utf8")
  );
}

(async () => {

  const browser = await chromium.launch({
    headless: false
  });

  const page = await browser.newPage();

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

            console.log(
  product.name,
  "Inventory:",
  product.inventory_quantity
);

const currentStock = product.inventory_quantity;

const previous =
  previousStock[product.name] || 0;

if (
  previous <= 0 &&
  currentStock > 0
) {

  await bot.sendMessage(
    process.env.CHAT_ID,
    `🚨 BACK IN STOCK

Product:
${product.name}

Inventory:
${currentStock}`
  );

  console.log("Notification Sent");

}

previousStock[product.name] =
  currentStock;

          }

        }
        fs.writeFileSync(
  "stock.json",
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
await page.waitForSelector("#search");

await page.fill("#search", "302017");

await page.waitForTimeout(1000);

await page.keyboard.press("ArrowDown");

await page.waitForTimeout(300);

await page.keyboard.press("Enter");
await page.waitForTimeout(5000);
await browser.close();

})();