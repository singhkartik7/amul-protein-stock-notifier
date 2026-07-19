const {
    getSessionCache,
    refreshSession
} = require("./cacheService");

const {
    curlRequest,
    CurlHttpError
} = require("../utils/curl");

const {
    calculateTid
} = require("../utils/tid");

async function getStoreId(
    pincode,
    storeMap
) {
    let session = getSessionCache();

    try {
        console.log("Using session:", session.sessionTid);
        console.log("Looking up pincode:", pincode);

        const url =
            `https://shop.amul.com/entity/pincode?limit=50&filters[0][field]=pincode&filters[0][value]=${encodeURIComponent(
                pincode
            )}&filters[0][operator]=regex&cf_cache=1h`;

        const response = await curlRequest({
            method: "GET",
            url,
            jar: session.jar,
            headers: {
                referer: "https://shop.amul.com/en/browse/protein",
                accept: "application/json",
                frontend: "1",
                tid: calculateTid(session.sessionTid)
            }
        });

        const json = JSON.parse(response.body);

        if (!json.records || json.records.length === 0) {
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
        if (
            err instanceof CurlHttpError &&
            err.status === 401
        ) {
            console.log("🔄 Session expired while fetching pincode...");
            await refreshSession();

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