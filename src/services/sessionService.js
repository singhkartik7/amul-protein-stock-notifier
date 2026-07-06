const axios = require("axios");
const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");
const crypto = require("crypto");

const STORE_ID = "62fa94df8c13af2e242eba16";

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

// Get session FIRST
const info = await client.get(
    "https://shop.amul.com/user/info.js"
);
const debugCookies = await jar.getCookies(
    "https://shop.amul.com"
);

console.log("\nCookies after user/info:");

console.log(
    debugCookies.map(c => `${c.key}=${c.value}`)
);
const match = info.data.match(
    /"tid":"([^"]+)"/
);

if (!match) {
    throw new Error("Could not extract session tid.");
}
/*try{
// THEN warm up the pincode endpoint
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

const apiTid = calculateTid(match[1]);

await client.put(
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
}
catch (err) {

    console.log("SESSION INIT FAILED");
    console.log(err.response?.status);
    console.log(err.response?.data);
    
}*/
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