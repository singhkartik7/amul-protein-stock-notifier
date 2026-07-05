const { getSessionCache } = require("./cacheService");

async function getStoreId(
    pincode,
    cookieHeader,
    storeMap
) {

    const headers = {
        ...getSessionCache().pincodeHeaders,
        cookie: cookieHeader
    };

    delete headers.host;
    delete headers["content-length"];

    const response = await fetch(
        `https://shop.amul.com/entity/pincode?limit=50&filters[0][field]=pincode&filters[0][value]=${pincode}&filters[0][operator]=regex&cf_cache=1h`,
        {
            headers
        }
    );

    console.log(pincode, response.status);

    if (response.status === 401) {

        throw new Error("SESSION_EXPIRED");

    }

    if (!response.ok) {

        throw new Error(
            `Failed to fetch pincode (${response.status})`
        );

    }

    const json = await response.json();

    if (!json.records || json.records.length === 0) {

        throw new Error(
            `Pincode ${pincode} not found`
        );

    }

    const alias = json.records[0].substore.toLowerCase();

    const storeId = storeMap.get(alias);

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
    getStoreId
};