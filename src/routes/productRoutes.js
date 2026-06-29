const express = require("express");

const router = express.Router();
const {

    getAllProducts

} = require("../models/productModel");

router.get("/", async (req, res) => {

    try {

        const products =
            await getAllProducts();

        res.json(

            products.map(product => ({

                id: product.id,

                name: product.product_name,

                price: Number(product.price)

            }))

        );

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Server Error"

        });

    }

});

module.exports = router;