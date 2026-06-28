const pool = require("../database/db");

async function findUserByUsername(username) {

    const result = await pool.query(

        `SELECT * FROM users
         WHERE username = $1`,

        [username]

    );

    return result.rows[0];

}

async function createUser(username, password) {

    const result = await pool.query(

        `INSERT INTO users
        (username, password)

        VALUES ($1, $2)

        RETURNING *`,

        [username, password]

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

    findUserByUsername,

    createUser,

    findUserById,

    deleteUser

};