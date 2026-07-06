const axios = require("axios");
const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");

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
    await client.get(
        "https://shop.amul.com/en/browse/protein"
    );

    // Create session
    await client.get(
        "https://shop.amul.com/user/info.js"
    );

    // Load alias -> storeId map
    const storeMap = await getStoreMap(client);

    // Lookup pincode
    const response = await client.get(
        "https://shop.amul.com/entity/pincode",
        {
            params: {
                limit: 50,
                "filters[0][field]": "pincode",
                "filters[0][value]": pincode,
                "filters[0][operator]": "regex",
                cf_cache: "1h"
            },
            headers: {
                referer: "https://shop.amul.com/en/browse/protein",
                accept: "application/json"
            }
        }
    );

    if (!response.data.records.length) {

        throw new Error(
            `Pincode ${pincode} not found`
        );

    }

    const alias =
        response.data.records[0].substore.toLowerCase();

    const storeId =
        storeMap.get(alias);

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