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