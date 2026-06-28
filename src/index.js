require("dotenv").config();

const headless = process.env.HEADLESS === "true";

const { launchBrowser } = require("./browser");
const { openProteinPage } = require("./amul");
const { selectPincode } = require("./pincode");
const { processProducts } = require("./products");
const { shouldNotify } = require("./notifier");
const { sendNotification } = require("./telegram");

const {
    getGroupedPreferences
} = require("./models/preferenceModel");

const {
    loadStockMap
} = require("./models/stockModel");

let isRunning = false;

async function checkStock() {

    if (isRunning) {

        console.log("Previous check still running...");

        return;

    }

    isRunning = true;

    const browser = await launchBrowser(headless);

    try {

        const groupedPreferences =
            await getGroupedPreferences();

        const stockMap =
            await loadStockMap();

        let productsFound = 0;

        for (const pincode of Object.keys(groupedPreferences)) {

            try {

                console.log(`Checking pincode ${pincode}`);

                const page =
                    await browser.newPage();

                await openProteinPage(page);

                await selectPincode(
                    page,
                    pincode
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

const activeUsers =
    groupedPreferences[pincode].users.filter(user => {

        if (!user.notifyUntil) {

            return false;

        }

        return new Date(user.notifyUntil) > new Date();

    });
    if (activeUsers.length === 0) {

    console.log(`No active users for ${pincode}`);

    await page.close();

    continue;

}

productsFound += await processProducts(

    data,

    activeUsers,

    stockMap,

    sendNotification,

    shouldNotify,

    pincode

);

                await page.close();

            }

            catch (err) {

                console.log(

                    `Error checking ${pincode}:`,

                    err.message

                );

            }

        }

        console.log(

            `Products Found: ${productsFound}`

        );

    }

    catch (err) {

        console.log(err);

    }

    finally {

        await browser.close();

        isRunning = false;

    }

}

function startStockChecker() {

    checkStock();

    setInterval(() => {

        console.log("\n=================================");

        console.log(

            "Checking stock:",

            new Date().toLocaleString()

        );

        console.log("=================================\n");

        checkStock();

    }, 1 * 60 * 1000);

}

module.exports = {

    startStockChecker

};