const {
    refreshSession
} = require("./cacheService");

async function getProducts(
    storeId,
    cookieHeader,
    productHeaders
) {

    const productUrl =
        `https://shop.amul.com/api/1/entity/ms.products` +
        `?fields[name]=1` +
        `&fields[brand]=1` +
        `&fields[categories]=1` +
        `&fields[collections]=1` +
        `&fields[alias]=1` +
        `&fields[sku]=1` +
        `&fields[price]=1` +
        `&fields[compare_price]=1` +
        `&fields[original_price]=1` +
        `&fields[images]=1` +
        `&fields[metafields]=1` +
        `&fields[discounts]=1` +
        `&fields[catalog_only]=1` +
        `&fields[is_catalog]=1` +
        `&fields[seller]=1` +
        `&fields[available]=1` +
        `&fields[inventory_quantity]=1` +
        `&fields[net_quantity]=1` +
        `&fields[num_reviews]=1` +
        `&fields[avg_rating]=1` +
        `&fields[inventory_low_stock_quantity]=1` +
        `&fields[inventory_allow_out_of_stock]=1` +
        `&fields[default_variant]=1` +
        `&fields[variants]=1` +
        `&fields[lp_seller_ids]=1` +
        `&filters[0][field]=categories` +
        `&filters[0][value][0]=protein` +
        `&filters[0][operator]=in` +
        `&filters[0][original]=1` +
        `&facets=true` +
        `&facetgroup=default_category_facet` +
        `&limit=32` +
        `&total=1` +
        `&start=0` +
        `&v=5` +
        `&device_type=other` +
        `&substore=${storeId}`;

    const headers = {
        ...productHeaders,
        cookie: cookieHeader
    };

    delete headers.host;
    delete headers["content-length"];

    const response = await fetch(productUrl, {
        headers
    });

    if (response.status === 401) {

    await refreshSession();

    throw new Error("SESSION_REFRESHED");

}

    if (!response.ok) {

        throw new Error(
            `Products API failed (${response.status})`
        );

    }

    const json = await response.json();

    return json.data;

}

module.exports = {

    getProducts

};