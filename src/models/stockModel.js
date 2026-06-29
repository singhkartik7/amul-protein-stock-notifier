const pool = require("../database/db");

async function getStock(productId, pincode) {

    const result = await pool.query(

        `SELECT *

         FROM stock

         WHERE product_id = $1

         AND pincode = $2`,

        [

            productId,

            pincode

        ]

    );

    return result.rows[0];

}

async function saveStock(

    productId,

    pincode,

    lastStock

) {

    const existing =

        await getStock(

            productId,

            pincode

        );

    if (existing) {

        await pool.query(

            `UPDATE stock

             SET last_stock = $1

             WHERE product_id = $2

             AND pincode = $3`,

            [

                lastStock,

                productId,

                pincode

            ]

        );

    }

    else {

        await pool.query(

            `INSERT INTO stock

            (

                product_id,

                pincode,

                last_stock

            )

            VALUES

            (

                $1,

                $2,

                $3

            )`,

            [

                productId,

                pincode,

                lastStock

            ]

        );

    }

}

async function getAllStock() {

    const result = await pool.query(

        `SELECT *

         FROM stock`

    );

    return result.rows;

}

async function loadStockMap() {

    const result = await pool.query(

        `SELECT
            product_id,
            pincode,
            last_stock
         FROM stock`

    );

    const stockMap = new Map();

    for (const row of result.rows) {

        stockMap.set(

            `${row.pincode}|${row.product_id}`,

            row.last_stock

        );

    }

    return stockMap;

}

module.exports = {

    getStock,

    saveStock,

    getAllStock,

    loadStockMap

};