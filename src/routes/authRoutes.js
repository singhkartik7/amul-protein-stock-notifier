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

    findUserByEmail,

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
   const {
    fullName,
    password
} = req.body;

const email = req.body.email.trim().toLowerCase();

    if (!fullName || !email || !password) {
        return res.status(400).json({
            message: "All fields required"
        });
    }

    
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (fullName.trim().length < 2) {
    return res.status(400).json({
        message: "Please enter your full name."
    });
}

if (!emailRegex.test(email)) {
    return res.status(400).json({
        message: "Please enter a valid email."
    });
}
if (password.length < 6) {
    return res.status(400).json({
        message: "Password must be at least 6 characters."
    });
}    

const existingUser =
        await findUserByEmail(email);

    if (existingUser) {

        return res.status(400).json({

            message: "Email already exists"

        });

    }

   const hashedPassword =
    await bcrypt.hash(password, 10);

await createUser(

    fullName,
    email,

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
        const { email, password } = req.body;

    const user =
        await findUserByEmail(email);

   if (!user) {

    return res.status(401).json({

        message: "Invalid email or password"

    });

}

const isPasswordCorrect =
    await bcrypt.compare(

        password,

        user.password

    );

if (!isPasswordCorrect) {

    return res.status(401).json({

        message: "Invalid email or password"

    });

}
    const token = jwt.sign(

    {

        userId: user.id,

        email: user.email

    },

    process.env.JWT_SECRET,

    {

        expiresIn: "7d"

    }

);

res.json({

    message: "Login successful",

    token,

    email: user.email,

    fullName: user.full_name

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

        const email = req.user.email;

const user =
    await findUserByEmail(
        email
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