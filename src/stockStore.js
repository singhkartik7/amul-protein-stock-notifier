const fs = require("fs");

function loadStock() {
  if (!fs.existsSync("data/stock.json")) {
    return {};
  }

  return JSON.parse(
    fs.readFileSync(
      "data/stock.json",
      "utf8"
    )
  );
}

function saveStock(stock) {
  fs.writeFileSync(
    "data/stock.json",
    JSON.stringify(stock, null, 2)
  );

  console.log("Stock file updated");
}

module.exports = {
  loadStock,
  saveStock,
};