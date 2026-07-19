const { Impit } = require("impit");

(async () => {
    try {
        const impit = new Impit({
            browser: "chrome",
        });

        const response = await impit.fetch(
            "https://shop.amul.com/en/browse/protein"
        );

        console.log("Status:", response.status);
        console.log("URL:", response.url);

        const text = await response.text();
        console.log(text.substring(0, 500));
    } catch (err) {
        console.error(err);
    }
})();