const axios = require("axios");
const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");
const {
    calculateTid
} = require("../utils/tid");
const {
    getStoreMap
} = require("./storeService");

async function lookupStoreIdByPincode(pincode) {

    const jar = new CookieJar();

    const client = wrapper(
        axios.create({
            jar,
            withCredentials: true
        })
    );

    // Open Amul
    console.log("1. Opening homepage...");

await client.get(
    "https://shop.amul.com/en/browse/protein"
);

    // Create session
    console.log("2. Getting user info...");

const info = await client.get(
    "https://shop.amul.com/user/info.js"
);

const match = info.data.match(/"tid":"([^"]+)"/);

if (!match) {
    throw new Error("Could not extract session tid.");
}

const sessionTid = match[1];

const apiTid = calculateTid(sessionTid);


    // Lookup pincode

// Lookup pincode

let response;

try {

    console.log("3. Looking up pincode:", pincode);

    const qs =
    `limit=50&filters[0][field]=pincode&filters[0][value]=${pincode}&filters[0][operator]=regex&cf_cache=1h`;

response = await client.get(
    `https://shop.amul.com/entity/pincode?${qs}`,
    {
        headers: {
    referer: "https://shop.amul.com/en/browse/protein",
    accept: "application/json",
    frontend: "1",
    base_url: "https://shop.amul.com/en/browse/protein",
    tid: apiTid
}
    }
);

    console.log("✅ Pincode lookup success");

} catch (err) {

    console.log("❌ PINCODE LOOKUP FAILED");
    console.log("Status:", err.response?.status);
    console.log("Response:", err.response?.data);

    throw err;

}
    if (!response.data.records.length) {

        throw new Error(
            `Pincode ${pincode} not found`
        );

    }

    const alias =
        response.data.records[0].substore.toLowerCase();

        console.log("4. Loading store map...");

const storeMap = await getStoreMap(client);

console.log("✅ Store map loaded.");

    const storeId =
        storeMap.get(alias);

        console.log("Alias:", alias);
console.log("Store ID:", storeId);

    if (!storeId) {

        throw new Error(
            `No store found for alias ${alias}`
        );

    }

    return {

        alias,

        storeId

    };

}

module.exports = {

    lookupStoreIdByPincode

};