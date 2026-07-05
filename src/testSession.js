const {
    getSession
} = require("./services/sessionService");

const {
    getStoreMap
} = require("./services/storeService");

const {
    getStoreId
} = require("./services/pincodeService");

const {
    getProducts
} = require("./services/productService");

(async () => {

    const session =
        await getSession();

    const storeMap =
        await getStoreMap(
            session.cookieHeader
        );

    const store =
        await getStoreId(
            "302017",
            session.cookieHeader,
            storeMap
        );

    const products =
        await getProducts(
            store.storeId,
            session.cookieHeader,
            session.productHeaders
        );

    console.log(
        products.length
    );

    console.log(
        products[0].name
    );

})();