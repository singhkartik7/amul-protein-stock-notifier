const pool = require("../database/db");

async function getStock(productId, storeId) {

    const result = await pool.query(

        `SELECT *

         FROM stock

         WHERE product_id = $1

         AND store_id = $2`,

        [

            productId,

            storeId

        ]

    );

    return result.rows[0];

}

async function saveStock(

    productId,

    storeId,

    lastStock

) {

    const existing =

        await getStock(

            productId,

            storeId

        );

    if (existing) {

        await pool.query(

            `UPDATE stock

             SET last_stock = $1

             WHERE product_id = $2

             AND store_id = $3`,

            [

                lastStock,

                productId,

                storeId

            ]

        );

    }

    else {

        await pool.query(

            `INSERT INTO stock

            (

                product_id,

                store_id,

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

                storeId,

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
            store_id,
            last_stock
         FROM stock`

    );

    const stockMap = new Map();

    for (const row of result.rows) {

        stockMap.set(

            `${row.store_id}|${row.product_id}`,

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