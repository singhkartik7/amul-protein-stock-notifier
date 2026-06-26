async function openProteinPage(page) {
  await page.goto(
    "https://shop.amul.com/en/browse/protein",
    {
      waitUntil: "domcontentloaded",
      timeout: 60000
    }
  );
}

module.exports = {
  openProteinPage,
};