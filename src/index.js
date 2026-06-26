require("dotenv").config();
const headless =
    process.env.HEADLESS === "true";
const { selectPincode } = require("./pincode");
const fs = require("fs");
const path = require("path");
const PREFERENCES_FILE = path.join(
    __dirname,
    "..",
    "data",
    "preferences.json"
);

const { openProteinPage } = require("./amul");
const { processProducts } = require("./products");
const {
  loadStock,
  saveStock,
} = require("./stockStore");
const { shouldNotify } = require("./notifier");

const { launchBrowser } = require("./browser");

const { sendNotification } = require("./telegram");
function loadPreferences() {

    return JSON.parse(
        fs.readFileSync(
            PREFERENCES_FILE,
            "utf8"
        )
    );

}

let previousStock = loadStock();
let isRunning = false;

async function checkStock() {

    if (isRunning) {
        console.log("Previous check still running...");
        return;
    }

    isRunning = true;
    const preferences = loadPreferences();

    const browser = await launchBrowser(headless);

    

    try {

       let productsFound = 0;

    for (const user of preferences) {

        if (!user.chatId) {

            continue;

        }
        try{

        

        console.log(
            `Checking ${user.username} (${user.pincode})`
        );

        const page = await browser.newPage();

        await openProteinPage(page);

        await selectPincode(
            page,
            user.pincode
        );

        const response =
            await page.waitForResponse( response =>

        response.url().includes("ms.products") &&
        response.status() === 200,

    { timeout: 15000 });

        console.log("Products API received");

        const data =
            await response.json();

        const found =
            await processProducts(

    data,

    user.products,

    previousStock,

    sendNotification,

    user.chatId,

    user.pincode,

    shouldNotify

);

        productsFound += found;

        await page.close();

    }
    catch (err) {

    console.log(
        `Error checking ${user.username}:`,
        err.message
    );

}}

    saveStock(previousStock);

    console.log(`Products Found: ${productsFound}`);

    }
    catch (err) {

        console.log(err.message);

    }
    finally {

        await browser.close();

        isRunning = false;

    }

}

function startStockChecker() {

    checkStock();

    setInterval(() => {

        console.log(
            "\n================================="
        );

        console.log(
            "Checking stock:",
            new Date().toLocaleString()
        );

        console.log(
            "=================================\n"
        );

        checkStock();

    }, 5 * 60 * 1000);

}

module.exports = {
    startStockChecker
};