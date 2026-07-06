const axios = require("axios");
const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");

async function getSession() {

    const jar = new CookieJar();

    const client = wrapper(
        axios.create({
            jar,
            withCredentials: true
        })
    );

    // Open Amul homepage
    await client.get(
        "https://shop.amul.com/en/browse/protein"
    );

await client.get(
    "https://shop.amul.com/entity/pincode",
    {
        params: {
            limit: 50,
            "filters[0][field]": "pincode",
            "filters[0][value]": "302017",
            "filters[0][operator]": "regex",
            cf_cache: "1h"
        },
        headers: {
            referer: "https://shop.amul.com/en/browse/protein",
            accept: "application/json"
        }
    }
);

    // Get session
    const info = await client.get(
        "https://shop.amul.com/user/info.js"
    );

    const match = info.data.match(
        /"tid":"([^"]+)"/
    );

    if (!match) {

        throw new Error(
            "Could not extract session tid."
        );

    }

    const cookies = await jar.getCookies(
        "https://shop.amul.com"
    );

    const cookieHeader = cookies
        .map(cookie => `${cookie.key}=${cookie.value}`)
        .join("; ");

    return {

        client,

        jar,

        sessionTid: match[1],

        cookieHeader

    };

}

module.exports = {

    getSession

};