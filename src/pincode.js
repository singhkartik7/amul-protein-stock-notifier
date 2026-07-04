async function selectPincode(page, pincode) {
  await page.fill("#search", pincode);

  

  await page.waitForSelector("a.searchitem-name", {
    timeout: 10000,
  });

 

  await page.click("a.searchitem-name");
}

module.exports = {
  selectPincode,
};