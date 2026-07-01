const pool = require("../database/db");
const crypto = require("crypto");
async function findUserByEmail(email) {

    const result = await pool.query(

        `SELECT * FROM users
         WHERE email = $1`,

        [email]

    );

    return result.rows[0];

}

async function createUser(fullName, email, password) {

    const result = await pool.query(

        `INSERT INTO users
        (full_name, email, password)

        VALUES ($1, $2, $3)

        RETURNING *`,

        [fullName, email, password]

    );

    return result.rows[0];

}

async function findUserById(id) {

    const result = await pool.query(

        `SELECT * FROM users
         WHERE id = $1`,

        [id]

    );

    return result.rows[0];

}
// ========================================
// Telegram Token
// ========================================

async function findUserByTelegramToken(token) {

    const result = await pool.query(

        `SELECT *

         FROM users

         WHERE telegram_token = $1`,

        [token]

    );

    return result.rows[0];

}

async function saveTelegramToken(userId, token) {

    await pool.query(

        `UPDATE users

         SET telegram_token = $1

         WHERE id = $2`,

        [

            token,

            userId

        ]

    );

}

function generateTelegramToken() {

    return crypto

        .randomBytes(16)

        .toString("hex");

}
async function deleteUser(id) {

    await pool.query(

        `DELETE FROM users
         WHERE id = $1`,

        [id]

    );

}

module.exports = {

    findUserByEmail,

    createUser,

    findUserById,

    deleteUser,

    findUserByTelegramToken,

    saveTelegramToken,

    generateTelegramToken

};