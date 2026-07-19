require("dotenv").config();

const { getProducts } = require("./src/services/productService");

(async () => {
    try {
        const storeId = "YOUR_STORE_ID"; // use one that you know works

        console.log(`Fetching products for store: ${storeId}`);

        const products = await getProducts(storeId);

        console.log("=================================");
        console.log("SUCCESS");
        console.log("=================================");

        if (Array.isArray(products)) {
            console.log(`Products returned: ${products.length}`);

            products.slice(0, 10).forEach((p, i) => {
                console.log(`${i + 1}. ${p.name} | Qty: ${p.inventory_quantity}`);
            });
        } else {
            console.log(products);
        }
    } catch (err) {
        console.error("FAILED");
        console.error(err);
    }
})();