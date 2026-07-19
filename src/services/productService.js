const crypto = require("crypto");
const { parse: parseCookie } = require("tough-cookie");
const { curlRequest, CurlHttpError } = require("../utils/curl");

const {
    getSessionCache,
    refreshSession
} = require("./cacheService");

const STORE_ID = "62fa94df8c13af2e242eba16";
const { getStoreMapCache } = require("./cacheService");

const SHOP_URL = "https://shop.amul.com";

function calculateTid(sessionTid) {

    const timestamp = Date.now().toString();

    const random = Math.floor(Math.random() * 1000);

    const hash = crypto
        .createHash("sha256")
        .update(
            `${STORE_ID}:${timestamp}:${random}:${sessionTid}`
        )
        .digest("hex");

    return `${timestamp}:${random}:${hash}`;

}


async function applySetCookies(jar, setCookies, requestUrl) {

    if (!setCookies || !setCookies.length) return;

    const requestHost = new URL(requestUrl).hostname;

    for (const cookieString of setCookies) {

        const cookie = parseCookie(cookieString, { loose: true });
        if (!cookie || !cookie.key) continue;

        cookie.domain = requestHost;
        await jar.setCookie(cookie.toString(), requestUrl);

    }

}

async function setStorePreference(
    jar,
    sessionTid,
    alias
) {

    const url = "https://shop.amul.com/entity/ms.settings/_/setPreferences";
    const cookie = await jar.getCookieString(SHOP_URL);

    const response = await curlRequest({
        url,
        method: "PUT",
        headers: {
            referer:
                "https://shop.amul.com/en/browse/protein",
            accept: "application/json",
            "content-type": "application/json",
            frontend: "1",
            tid: calculateTid(sessionTid),
            ...(cookie ? { cookie } : {})
        },
        body: {
            data: {
                store: alias
            }
        }
    });

    await applySetCookies(jar, response.setCookies, url);

}



async function getProducts(
    storeId
) {

    let session = getSessionCache();

    try {
let storeMap = getStoreMapCache();

let alias = storeMap.get(storeId);

if (!alias) {

    throw new Error(
        `Alias not found for store ${storeId}`
    );

}
        await setStorePreference(

            session.jar,

            session.sessionTid,

            alias

        );

        const params = new URLSearchParams();

        params.append("fields[name]", "1");
        params.append("fields[brand]", "1");
        params.append("fields[categories]", "1");
        params.append("fields[collections]", "1");
        params.append("fields[alias]", "1");
        params.append("fields[sku]", "1");
        params.append("fields[price]", "1");
        params.append("fields[compare_price]", "1");
        params.append("fields[original_price]", "1");
        params.append("fields[images]", "1");
        params.append("fields[metafields]", "1");
        params.append("fields[discounts]", "1");
        params.append("fields[catalog_only]", "1");
        params.append("fields[is_catalog]", "1");
        params.append("fields[seller]", "1");
        params.append("fields[available]", "1");
        params.append("fields[inventory_quantity]", "1");
        params.append("fields[net_quantity]", "1");
        params.append("fields[num_reviews]", "1");
        params.append("fields[avg_rating]", "1");
        params.append("fields[inventory_low_stock_quantity]", "1");
        params.append("fields[inventory_allow_out_of_stock]", "1");
        params.append("fields[default_variant]", "1");
        params.append("fields[variants]", "1");
        params.append("fields[lp_seller_ids]", "1");

        params.append("filters[0][field]", "categories");
        params.append("filters[0][value][0]", "protein");
        params.append("filters[0][operator]", "in");
        params.append("filters[0][original]", "1");

        params.append("facets", "true");
        params.append("facetgroup", "default_category_facet");

        params.append("limit", "32");
        params.append("total", "1");
        params.append("start", "0");
        params.append("v", "5");
        params.append("device_type", "other");
        params.append("substore", storeId);

        
        const query = params
            .toString()
            .replace(/%5B/g, "[")
            .replace(/%5D/g, "]");

        const url = `https://shop.amul.com/api/1/entity/ms.products?${query}`;

        const cookie = await session.jar.getCookieString(SHOP_URL);

        const response = await curlRequest({
            url,
            method: "GET",
            headers: {

                referer:
                    "https://shop.amul.com/en/browse/protein",

                accept:
                    "application/json",

                frontend: "1",

                tid: calculateTid(
                    session.sessionTid
                ),

                ...(cookie ? { cookie } : {})

            }
        });

        await applySetCookies(session.jar, response.setCookies, url);

        const data = JSON.parse(response.body);

        return data.data;

    }

    catch (err) {

        if (
            err instanceof CurlHttpError &&
            err.status === 401
        ) {

            await refreshSession();

            session = getSessionCache();
            storeMap = getStoreMapCache();

alias = storeMap.get(storeId);

            return getProducts(
                storeId,
               
            );

        }

        throw err;

    }

}

module.exports = {

    getProducts

};
