require("dotenv").config();

const headless = process.env.HEADLESS === "true";

const { launchBrowser } = require("../browser");
const { openProteinPage } = require("../amul");
const { selectPincode } = require("../pincode");

const { saveProduct } = require("../models/productModel");

const ADMIN_PINCODE = "302017";

async function syncProducts() {

    const browser =
        await launchBrowser(headless);

    try {

        const page =
            await browser.newPage();

        await openProteinPage(page);

        await selectPincode(

            page,

            ADMIN_PINCODE

        );

        const response =
            await page.waitForResponse(

                response =>

                    response.url().includes("ms.products") &&

                    response.status() === 200,

                {

                    timeout: 15000

                }

            );

        const data =
            await response.json();

        if (!data.data) {

            console.log(

                "No products found."

            );

            return;

        }

        let count = 0;

        for (const product of data.data) {

            await saveProduct(

                product._id,

                product.name,

                product.price,

                product.sku

            );

            console.log(

                `✔ ${product.name}`

            );

            count++;

        }

        console.log(

            `\n${count} products synced successfully.`

        );

    }

    catch (err) {

        console.log(err);

    }

    finally {

        await browser.close();

    }

}

syncProducts();