async function selectPincode(page, pincode) {

    let t = Date.now();

    await page.fill("#search", pincode);

    console.log(
        `      Fill: ${Date.now() - t} ms`
    );

    t = Date.now();

    await page.waitForSelector("a.searchitem-name", {
        timeout: 10000,
    });

    console.log(
        `      Suggestion: ${Date.now() - t} ms`
    );

    t = Date.now();

    await page.click("a.searchitem-name");

    console.log(
        `      Click: ${Date.now() - t} ms`
    );
}

module.exports = {
  selectPincode,
};