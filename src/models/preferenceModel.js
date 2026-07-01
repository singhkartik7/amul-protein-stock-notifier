const pool = require("../database/db");

async function getPreferenceByUserId(userId) {

    const result = await pool.query(

        `SELECT * FROM preferences
         WHERE user_id = $1`,

        [userId]

    );

    return result.rows[0];

}

async function savePreference(
    userId,
    pincode,
    chatId = null
) {

    const existing =
        await getPreferenceByUserId(userId);

    if (existing) {

        await pool.query(

            `UPDATE preferences

             SET pincode = $1,
                 chat_id = $2

             WHERE user_id = $3`,

            [
                pincode,
                chatId,
                userId
            ]

        );

        return await getPreferenceByUserId(
            userId
        );

    }

    const result = await pool.query(

        `INSERT INTO preferences

        (user_id, pincode, chat_id)

        VALUES ($1,$2,$3)

        RETURNING *`,

        [
            userId,
            pincode,
            chatId
        ]

    );

    return result.rows[0];

}

async function deletePreference(userId) {

    await pool.query(

        `DELETE FROM preferences

         WHERE user_id = $1`,

        [userId]

    );

}

async function getAllPreferences() {

    const result = await pool.query(`

        SELECT

            users.email,

            preferences.id,

            preferences.pincode,

            preferences.chat_id

        FROM preferences

        JOIN users

        ON preferences.user_id = users.id

    `);

    return result.rows;

}

async function getGroupedPreferences() {

    const result = await pool.query(`
SELECT

    preferences.pincode,

    preferences.chat_id,

    preferences.notify_until,

    users.email,

    products.product_name

FROM preferences

JOIN users

    ON users.id = preferences.user_id

LEFT JOIN tracked_products

    ON tracked_products.preference_id = preferences.id

LEFT JOIN products

    ON products.id = tracked_products.product_id

WHERE preferences.chat_id IS NOT NULL

ORDER BY preferences.pincode

    `);

    const grouped = {};

    for (const row of result.rows) {

        if (!grouped[row.pincode]) {

            grouped[row.pincode] = {
                users: []
            };

        }

        let user = grouped[row.pincode].users.find(

            u => u.email === row.email

        );

        if (!user) {

            user = {

                email: row.email,

                chatId: row.chat_id,

                notifyUntil: row.notify_until,

                products: []

            };

            grouped[row.pincode].users.push(user);

        }

        if (row.product_name) {

            user.products.push(row.product_name);

        }

    }

    return grouped;

}

async function updateNotifyUntil(userId, notifyUntil) {

    await pool.query(

        `UPDATE preferences

         SET notify_until = $1

         WHERE user_id = $2`,

        [

            notifyUntil,

            userId

        ]

    );

}

async function stopNotifications(userId) {

    await pool.query(

        `UPDATE preferences

         SET notify_until = NULL

         WHERE user_id = $1`,

        [

            userId

        ]

    );

}
module.exports = {

    getPreferenceByUserId,

    savePreference,

    deletePreference,

    getAllPreferences,

    getGroupedPreferences,

    updateNotifyUntil,

    stopNotifications

};