async function getProductLinks(page) {

    const productLinks = await page.evaluate(() => {

        const map = {};

        document.querySelectorAll("a").forEach(link => {

            const href = link.href;

            if (!href.includes("/product/")) {

                return;

            }

            const nameElement = link.querySelector("h3,h4,h5,p");

            if (!nameElement) {

                return;

            }

            const name = nameElement.innerText.trim();

            if (name) {

                map[name] = href;

            }

        });

        return map;

    });

    return productLinks;

}

module.exports = {

    getProductLinks

};