const pool = require("../database/db");

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

    deleteUser

};