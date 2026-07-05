const { launchBrowser } = require("../browser");
const { openProteinPage } = require("../amul");
const { selectPincode } = require("../pincode");

async function getSession() {

    const browser = await launchBrowser(true);

    const page = await browser.newPage();

    let productHeaders = null;

    page.on("request", request => {

        if (
            request.url().includes("ms.products") &&
            request.url().includes("substore=")
        ) {

            productHeaders = request.headers();

        }

    });

    await openProteinPage(page);

    // Any valid pincode works
    await selectPincode(page, "302017");

    await page.waitForTimeout(3000);

    const cookies = await page.context().cookies();

    await browser.close();

    if (!productHeaders) {

        throw new Error("Could not capture product headers.");

    }

    const cookieHeader = cookies
        .map(cookie => `${cookie.name}=${cookie.value}`)
        .join("; ");

    return {

        cookieHeader,
        productHeaders

    };

}

module.exports = {

    getSession

};