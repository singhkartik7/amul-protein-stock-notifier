const pool = require("../database/db");

async function deleteTrackedProducts(preferenceId) {

    await pool.query(

        `DELETE FROM tracked_products
         WHERE preference_id = $1`,

        [preferenceId]

    );

}

async function addTrackedProducts(

    preferenceId,

    productIds

) {

    for (const productId of productIds) {

        await pool.query(

            `INSERT INTO tracked_products

            (

                preference_id,

                product_id

            )

            VALUES

            (

                $1,

                $2

            )`,

            [

                preferenceId,

                productId

            ]

        );

    }

}

async function getTrackedProducts(

    preferenceId

) {

    const result = await pool.query(

        `SELECT

            product_id

        FROM tracked_products

        WHERE preference_id = $1`,

        [

            preferenceId

        ]

    );

    return result.rows.map(

        row => row.product_id

    );

}

async function getProductsForPreference(

    preferenceId

) {

    const result = await pool.query(

        `SELECT

            product_id

        FROM tracked_products

        WHERE preference_id = $1`,

        [

            preferenceId

        ]

    );

    return result.rows.map(

        row => row.product_id

    );

}

module.exports = {

    deleteTrackedProducts,

    addTrackedProducts,

    getTrackedProducts,

    getProductsForPreference

};