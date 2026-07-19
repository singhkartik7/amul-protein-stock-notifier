
const { CookieJar } = require("tough-cookie");

const crypto = require("crypto");
const { curlRequest, CurlHttpError } = require("../utils/curl");

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

   

  // Open Amul homepage
await curlRequest({
    method: "GET",
    url: "https://shop.amul.com/en/browse/protein",
    jar
});

// Get session FIRST
const info = await curlRequest({
    method: "GET",
    url: "https://shop.amul.com/user/info.js",
    jar
});
console.log("========== USER INFO ==========");
console.log("Status:", info.status);
console.log("Set-Cookies:", info.setCookies);
console.log("Body:");
console.log(info.body);
console.log("===============================");
const debugCookies = await jar.getCookies(
    "https://shop.amul.com"
);

console.log("\nCookies after user/info:");

console.log(
    debugCookies.map(c => `${c.key}=${c.value}`)
);
const match = info.body.match(
    /"tid":"([^"]+)"/
);
if (!match) {
    throw new Error("Could not extract session tid.");
}

    const cookies = await jar.getCookies(
        "https://shop.amul.com"
    );

    const cookieHeader = cookies
        .map(cookie => `${cookie.key}=${cookie.value}`)
        .join("; ");

    return {

       

        jar,

        sessionTid: match[1],

        cookieHeader

    };

}

module.exports = {

    getSession

};