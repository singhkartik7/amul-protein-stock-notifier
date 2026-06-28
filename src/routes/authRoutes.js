const express = require("express");


const router = express.Router();
const {

    findUserByUsername,

    createUser,

    deleteUser

} = require("../models/userModel");

const {

    deletePreference,

    getPreferenceByUserId

} = require("../models/preferenceModel");

const pool = require("../database/db");

router.post("/signup", async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password required"
        });
    }

    const existingUser =
    await findUserByUsername(username);

if (existingUser) {

    return res.status(400).json({

        message: "Username already exists"

    });

}

await createUser(

    username,

    password

);

    res.json({
        message: "Signup successful"
    });

});
router.post("/login", async (req, res) => {

    const { username, password } = req.body;

    const user =
    await findUserByUsername(username);

    if (!user || user.password !== password) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    res.json({
        message: "Login successful"
    });

});

router.delete("/delete", async (req, res) => {

    try {

        const { username } = req.body;

        const user = await findUserByUsername(username);

        if (!user) {

            return res.status(404).json({

                message: "User not found"

            });

        }

        const preference = await getPreferenceByUserId(user.id);

        if (preference) {

            await pool.query(

                `DELETE FROM tracked_products
                 WHERE preference_id = $1`,

                [preference.id]

            );

            await deletePreference(user.id);

        }

        await deleteUser(user.id);

        res.json({

            message: "Account deleted"

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            message: "Failed to delete account"

        });

    }

});
module.exports = router;