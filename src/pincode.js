async function selectPincode(page, pincode) {
  await page.fill("#search", pincode);

  console.log("Pincode entered");

  await page.waitForSelector("a.searchitem-name", {
    timeout: 10000,
  });

  console.log("Suggestion appeared");

  await page.click("a.searchitem-name");
}

module.exports = {
  selectPincode,
};