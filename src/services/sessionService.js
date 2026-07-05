const { launchBrowser } = require("../browser");
const { openProteinPage } = require("../amul");
const { selectPincode } = require("../pincode");

async function getSession() {

    const browser = await launchBrowser(true);

    const page = await browser.newPage();

    await page.route("**/*", (route) => {

    const type = route.request().resourceType();

    if (

        type === "image" ||
        type === "font" ||
        type === "media"

    ) {

        return route.abort();

    }

    route.continue();

});

    let productHeaders = null;
    let pincodeHeaders = null;

    page.on("request", request => {

        if (
            request.url().includes("ms.products") &&
            request.url().includes("substore=")
        ) {

            productHeaders = request.headers();

        }
        if (
    request.url().includes("/entity/pincode")
) {

    pincodeHeaders = request.headers();

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

if (!pincodeHeaders) {

    throw new Error("Could not capture pincode headers.");

}

    const cookieHeader = cookies
        .map(cookie => `${cookie.name}=${cookie.value}`)
        .join("; ");

    return {

        cookieHeader,
        productHeaders,
        pincodeHeaders

    };

}

module.exports = {

    getSession

};