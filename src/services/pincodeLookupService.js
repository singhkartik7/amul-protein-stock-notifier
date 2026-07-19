const {
    CookieJar
} = require("tough-cookie");

const {
    curlRequest
} = require("../utils/curl");

const {
    calculateTid
} = require("../utils/tid");

const {
    getStoreMap
} = require("./storeService");

async function lookupStoreIdByPincode(pincode) {

    const jar = new CookieJar();

    console.log("1. Opening homepage...");

    await curlRequest({
        method: "GET",
        url: "https://shop.amul.com/en/browse/protein",
        jar
    });

    console.log("2. Getting user info...");

    const info = await curlRequest({
        method: "GET",
        url: "https://shop.amul.com/user/info.js",
        jar
    });

    const match = info.body.match(/"tid":"([^"]+)"/);

    if (!match) {
        throw new Error("Could not extract session tid.");
    }

    const sessionTid = match[1];

    const tid = calculateTid(sessionTid);

    console.log("3. Looking up pincode:", pincode);

    const url =
        `https://shop.amul.com/entity/pincode?limit=50&filters[0][field]=pincode&filters[0][value]=${encodeURIComponent(
            pincode
        )}&filters[0][operator]=regex&cf_cache=1h`;

    const response = await curlRequest({
        method: "GET",
        url,
        jar,
        headers: {
            referer: "https://shop.amul.com/en/browse/protein",
            accept: "application/json",
            frontend: "1",
            tid
        }
    });

    const json = JSON.parse(response.body);

    if (!json.records || json.records.length === 0) {
        const error = new Error(
            "This pincode is not serviceable by Amul."
        );

        error.status = 400;

        throw error;
    }

    const alias =
        json.records[0].substore.toLowerCase();

    console.log("4. Loading store map...");

    const storeMap = await getStoreMap(jar);

    console.log("✅ Store map loaded.");

    const storeId = storeMap.get(alias);

    if (!storeId) {
        throw new Error(
            `No store found for alias ${alias}`
        );
    }

    console.log("Alias:", alias);
    console.log("Store ID:", storeId);

    return {
        alias,
        storeId
    };
}

module.exports = {
    lookupStoreIdByPincode
};