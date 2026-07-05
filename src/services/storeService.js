async function getStoreMap(client) {

    const response = await client.get(
        "https://shop.amul.com/ms/store/amul/cacheEntities/auto/EN/storedata.js?version=ms176132366_1781674242046"
    );

    const text = response.data;

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

        // Reverse lookup
        storeMap.set(
            store._id,
            store.alias.toLowerCase()
        );

    }

    return storeMap;

}

module.exports = {

    getStoreMap

};