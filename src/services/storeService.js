async function getStoreMap(cookieHeader) {

    const response = await fetch(
        "https://shop.amul.com/ms/store/amul/cacheEntities/auto/EN/storedata.js?version=ms176132366_1781674242046",
        {
            headers: {
                cookie: cookieHeader,
                referer: "https://shop.amul.com/en/browse/protein"
            }
        }
    );

    if (!response.ok) {

        throw new Error(
            `Failed to fetch storedata.js (${response.status})`
        );

    }

    const text = await response.text();

    const match = text.match(
        /var\s+cacheEntities\d+\s*=\s*(\{[\s\S]*?\});/
    );

    if (!match) {

        throw new Error(
            "Could not parse storedata.js"
        );

    }

    const cacheEntities = JSON.parse(match[1]);

    const storeMap = new Map();

    for (const store of cacheEntities["ms.substores"]) {

        storeMap.set(
            store.alias.toLowerCase(),
            store._id
        );

    }

    return storeMap;

}

module.exports = {

    getStoreMap

};