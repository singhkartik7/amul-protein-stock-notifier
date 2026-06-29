const pool = require("../database/db");

async function saveProduct(

    id,

    productName,

    price,

    sku

) {

    await pool.query(

        `INSERT INTO products

        (

            id,

            product_name,

            price,

            sku

        )

        VALUES

        (

            $1,

            $2,

            $3,

            $4

        )

        ON CONFLICT (id)

        DO UPDATE

        SET

            product_name = EXCLUDED.product_name,

            price = EXCLUDED.price,

            sku = EXCLUDED.sku`,

        [

            id,

            productName,

            price,

            sku

        ]

    );

}

async function getAllProducts() {

    const result = await pool.query(

        `SELECT

            id,

            product_name,

            price

        FROM products

        ORDER BY product_name`

    );

    return result.rows;

}
module.exports = {

    saveProduct,

    getAllProducts

};