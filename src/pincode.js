async function selectPincode(page, pincode) {

    await page.waitForSelector("#search", {
        state: "visible"
    });

    let t = Date.now();

    const input = page.locator("#search");

    await input.click();

    await page.keyboard.press("Control+A");
    await page.keyboard.press("Backspace");

    await page.keyboard.type(pincode, {
        delay: 0
    });

    console.log(
        `      Type: ${Date.now() - t} ms`
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

module.exports = {
  selectPincode,
};