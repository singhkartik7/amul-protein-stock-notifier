const express = require("express");

const router = express.Router();

const {
    getSession
} = require("../services/sessionService");

const {
    getStoreMap
} = require("../services/storeService");

const {
    getStoreId
} = require("../services/pincodeService");

const {
    getProducts
} = require("../services/productService");

router.get("/", async (req, res) => {

    try {

        const session =
            await getSession();

        const storeMap =
            await getStoreMap(
                session.cookieHeader
            );

        const pincodes = [
            "302017",
            "400028",
            "110091",
            "695583",
            "211011"
        ];

        const results = [];

        for (const pincode of pincodes) {

            const store =
                await getStoreId(
                    pincode,
                    session.cookieHeader,
                    storeMap
                );

            const products =
                await getProducts(
                    store.storeId,
                    session.cookieHeader,
                    session.productHeaders
                );

            results.push({

                pincode,

                alias: store.alias,

                storeId: store.storeId,

                products: products.length,

                firstProduct:
                    products.length
                        ? products[0].name
                        : null

            });

        }

        res.json({

            success: true,

            storesChecked: results.length,

            results

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

});

module.exports = router;