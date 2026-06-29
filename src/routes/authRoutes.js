const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

const {

    loginLimiter,

    signupLimiter

} = require("../middleware/rateLimiter");

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
// ========================================
// Signup
// ========================================
router.post("/signup", signupLimiter, async (req, res) => {
try{
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

   const hashedPassword =
    await bcrypt.hash(password, 10);

await createUser(

    username,

    hashedPassword

);

    res.json({
        message: "Signup successful"
    });

}
catch (err) {

        console.error(err);

        res.status(500).json({

            message: "Server Error"

        });

    }

});
// ========================================
// Login
// ========================================
router.post("/login", loginLimiter, async (req, res) => {

    try {
        const { username, password } = req.body;

    const user =
        await findUserByUsername(username);

   if (!user) {

    return res.status(401).json({

        message: "Invalid username or password"

    });

}

const isPasswordCorrect =
    await bcrypt.compare(

        password,

        user.password

    );

if (!isPasswordCorrect) {

    return res.status(401).json({

        message: "Invalid username or password"

    });

}
    const token = jwt.sign(

    {

        userId: user.id,

        username: user.username

    },

    process.env.JWT_SECRET,

    {

        expiresIn: "7d"

    }

);

res.json({

    message: "Login successful",

    token

});

}
catch (err) {

        console.error(err);

        res.status(500).json({

            message: "Server Error"

        });

    }

});


router.delete("/delete", auth, async (req, res) => {

    try {

        const username = req.user.username;

const user =
    await findUserByUsername(
        username
    );

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