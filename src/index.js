require("dotenv").config();

const headless = process.env.HEADLESS === "true";

const { launchBrowser } = require("./browser");
const { openProteinPage } = require("./amul");
const { selectPincode } = require("./pincode");
const { processProducts } = require("./products");
const { shouldNotify } = require("./notifier");
const { sendNotification } = require("./telegram");

const { getProductLinks } = require("./productLinks");


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

        const activeGroupedPreferences = {};

        for (const [pincode, group] of Object.entries(groupedPreferences)) {

            const activeUsers = group.users.filter(user =>

                user.notifyUntil &&
                new Date(user.notifyUntil) > new Date()

            );

            if (activeUsers.length > 0) {

                activeGroupedPreferences[pincode] = {

                    users: activeUsers

                };

            }

        }

        let productsFound = 0;

        for (const pincode of Object.keys(activeGroupedPreferences)) {

            if (!pincode || pincode.trim() === "") {

                console.log("Skipping empty pincode");

                continue;

            }

            try {

                console.log(`Checking pincode ${pincode}`);

                const page =
                    await browser.newPage();

                await openProteinPage(page);

                await selectPincode(
                    page,
                    pincode
                );
                const productLinks = await getProductLinks(page);

console.log(productLinks);
console.log(Object.keys(productLinks).length);

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


                productsFound += await processProducts(

                    data,

                    activeGroupedPreferences[pincode].users,

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

    }, 2.5 * 60 * 1000);

}
module.exports = {

    startStockChecker

};