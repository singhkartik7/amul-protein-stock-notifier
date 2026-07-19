const { Impit } = require("impit");
const crypto = require("crypto");

const STORE_ID = "62fa94df8c13af2e242eba16";

function calculateTid(sessionTid) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000);

    const hash = crypto
        .createHash("sha256")
        .update(`${STORE_ID}:${timestamp}:${random}:${sessionTid}`)
        .digest("hex");

    return `${timestamp}:${random}:${hash}`;
}

(async () => {
    const impit = new Impit({
        browser: "chrome"
    });

    // Step 1
    await impit.fetch("https://shop.amul.com/en/browse/protein");

    // Step 2
    const info = await impit.fetch("https://shop.amul.com/user/info.js");

    const text = await info.text();

    const match = text.match(/"tid":"([^"]+)"/);

    if (!match) {
        throw new Error("Could not find tid");
    }

    const sessionTid = match[1];

    console.log("Session Tid:", sessionTid);

    // Step 3
    const response = await impit.fetch(
        "https://shop.amul.com/entity/ms.settings/_/setPreferences",
        {
            method: "PUT",

            headers: {
                "content-type": "application/json",
                accept: "application/json",
                frontend: "1",
                referer: "https://shop.amul.com/en/browse/protein",
                tid: calculateTid(sessionTid)
            },

            body: JSON.stringify({
                data: {
                    store: "jaipur"
                }
            })
        }
    );

    console.log("Status:", response.status);

    const body = await response.text();

    console.log(body);
})();