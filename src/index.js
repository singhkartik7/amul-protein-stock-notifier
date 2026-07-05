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
    const totalStart = Date.now();

    const browserStart = Date.now();

const browser = await launchBrowser(headless);

console.log(
`Browser Launch   : ${Date.now()-browserStart} ms\n`
);

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
const pinStart = Date.now();
                const page =
                    await browser.newPage();
const gotoStart = Date.now();
                await openProteinPage(page);


console.log(
`   Page Load      : ${Date.now()-gotoStart} ms`
);
const selectStart = Date.now();
                await selectPincode(
                    page,
                    pincode
                );
                console.log(
`   Select Pincode : ${Date.now()-selectStart} ms`
);
const apiStart = Date.now();

const data = await new Promise((resolve, reject) => {

    const timeout = setTimeout(() => {

        page.off("response", listener);
        reject(new Error("Timed out waiting for products"));

    }, 15000);

    const listener = async (response) => {

        try {

            if (
                response.url().includes("ms.products") &&
                response.status() === 200
            ) {

                const json = await response.json();

                // Ignore empty product responses
                if (!json.data || json.data.length === 0) {
                    return;
                }

                clearTimeout(timeout);

                page.off("response", listener);
console.log("✅ Products response intercepted");
                resolve(json);

            }

        } catch (err) {

            clearTimeout(timeout);

            page.off("response", listener);

            reject(err);

        }

    };

    page.on("response", listener);

});

console.log(
`   API Response   : ${Date.now() - apiStart} ms`
);

const processStart = Date.now();
                productsFound += await processProducts(

                    data,

                    activeGroupedPreferences[pincode].users,

                    stockMap,

                    sendNotification,

                    shouldNotify,

                    pincode

                );
console.log(
`   Process Data   : ${Date.now()-processStart} ms`
);
            
await page.close();
console.log(
`   TOTAL          : ${Date.now()-pinStart} ms\n`
);    

            }

            catch (err) {

                console.log(

                    `Error checking ${pincode}:`,

                    err.message

                );

            }

        }

        console.log(

`====================================
Stock Check Finished
====================================
Time: ${(Date.now()-totalStart)/1000} sec
Products Found: ${productsFound}
Pincodes: ${Object.keys(activeGroupedPreferences).length}
====================================`

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

    }, 3.2 * 60 * 1000);

}
module.exports = {

    startStockChecker

};