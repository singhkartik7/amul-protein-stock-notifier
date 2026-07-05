const axios = require("axios");
const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");
const crypto = require("crypto");

const jar = new CookieJar();

const client = wrapper(
    axios.create({
        jar,
        withCredentials: true
    })
);

function calculateTid(sessionTid) {

    // Same store id used by the repository
    const storeID = "62fa94df8c13af2e242eba16";

    const timestamp = Date.now().toString();

    const random = Math.floor(Math.random() * 1000);

    const hash = crypto
        .createHash("sha256")
        .update(
            `${storeID}:${timestamp}:${random}:${sessionTid}`
        )
        .digest("hex");

    return `${timestamp}:${random}:${hash}`;

}

async function main() {

    console.log("Opening Amul...");

    await client.get(
        "https://shop.amul.com/en/browse/protein"
    );

    console.log("Getting session...");

    const info = await client.get(
        "https://shop.amul.com/user/info.js"
    );

    const match = info.data.match(/"tid":"([^"]+)"/);

    const sessionTid = match[1];

    console.log("Session Tid:", sessionTid);

    const apiTid = calculateTid(sessionTid);

    console.log("API Tid:", apiTid);

    console.log("Searching pincode...");

    const pincode = await client.get(
        "https://shop.amul.com/entity/pincode?limit=50&filters[0][field]=pincode&filters[0][value]=302017&filters[0][operator]=regex&cf_cache=1h",
        {
            headers: {
                referer: "https://shop.amul.com/en/browse/protein",
                accept: "application/json"
            }
        }
    );

    console.log("Pincode Status:", pincode.status);

    console.log("Setting store preference...");

    const preference = await client.put(
        "https://shop.amul.com/entity/ms.settings/_/setPreferences",
        {
            data: {
                store: "rajasthan"
            }
        },
        {
            headers: {
                referer: "https://shop.amul.com/en/browse/protein",
                accept: "application/json",
                frontend: "1",
                tid: apiTid
            }
        }
    );

    console.log("Preference Status:", preference.status);

    console.log("Calling Products API...");

    const products = await client.get(
        "https://shop.amul.com/api/1/entity/ms.products?fields[name]=1&fields[inventory_quantity]=1&filters[0][field]=categories&filters[0][value][0]=protein&filters[0][operator]=in&filters[0][original]=1&facets=true&facetgroup=default_category_facet&limit=32&total=1&start=0&v=5&device_type=other&substore=66505ff06510ee3d5903fd42",
        {
            headers: {
                referer: "https://shop.amul.com/en/browse/protein",
                accept: "application/json",
                frontend: "1",
                tid: apiTid
            }
        }
    );

    console.log("\nProducts Status:", products.status);

    console.log("Products Found:", products.data.data.length);

}

main().catch(err => {

    if (err.response) {

        console.log("\nStatus:", err.response.status);

        console.log(err.response.data);

    } else {

        console.log(err);

    }

});