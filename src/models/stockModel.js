const pool = require("../database/db");

async function getStock(productName, pincode) {

    const result = await pool.query(

        `SELECT *

         FROM stock

         WHERE product_name = $1

         AND pincode = $2`,

        [

            productName,

            pincode

        ]

    );

    return result.rows[0];

}

async function saveStock(

    productName,

    pincode,

    lastStock

) {

    const existing =

        await getStock(

            productName,

            pincode

        );

    if (existing) {

        await pool.query(

            `UPDATE stock

             SET last_stock = $1

             WHERE product_name = $2

             AND pincode = $3`,

            [

                lastStock,

                productName,

                pincode

            ]

        );

    }

    else {

        await pool.query(

            `INSERT INTO stock

            (

                product_name,

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

                productName,

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
            product_name,
            pincode,
            last_stock
         FROM stock`

    );

    const stockMap = new Map();

    for (const row of result.rows) {

        stockMap.set(

            `${row.pincode}|${row.product_name}`,

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