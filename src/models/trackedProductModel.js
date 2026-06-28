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
    products
) {

    for (const product of products) {

        await pool.query(

            `INSERT INTO tracked_products
            (preference_id, product_name)

            VALUES ($1, $2)`,

            [preferenceId, product]

        );

    }

}

async function getTrackedProducts(
    preferenceId
) {

    const result = await pool.query(

        `SELECT product_name

        FROM tracked_products

        WHERE preference_id = $1`,

        [preferenceId]

    );

    return result.rows.map(
        row => row.product_name
    );

}

async function getProductsForPreference(
    preferenceId
) {

    const result = await pool.query(

        `SELECT product_name

        FROM tracked_products

        WHERE preference_id = $1`,

        [preferenceId]

    );

    return result.rows.map(

        row => row.product_name

    );

}

module.exports = {

    deleteTrackedProducts,

    addTrackedProducts,

    getTrackedProducts,

    getProductsForPreference

};