const {
    getSessionCache,
    refreshSession
} = require("./cacheService");

async function getStoreId(
    pincode,
    storeMap
) {

    let session = getSessionCache();

    try {
console.log("Using session:", session.sessionTid);
console.log("Looking up pincode:", pincode);
        const response = await session.client.get(
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

        const json = response.data;

        if (!json.records.length) {
            throw new Error(`Pincode ${pincode} not found`);
        }

        const alias = json.records[0].substore.toLowerCase();

        const storeId = storeMap.get(alias);

        if (!storeId) {
            throw new Error(`No store found for alias ${alias}`);
        }

        return {
            alias,
            storeId
        };

    } catch (err) {

        if (err.response && err.response.status === 401) {

            console.log("🔄 Session expired while fetching pincode...");

            console.log("🔄 Session expired, refreshing...");

await refreshSession();

const newSession = getSessionCache();

console.log("New session:", newSession.sessionTid);

return getStoreId(
    pincode,
    storeMap
);

        }

        throw err;

    }

}

module.exports = {
    getStoreId
};