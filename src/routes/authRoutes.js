const express = require("express");
const fs = require("fs");

const router = express.Router();
const path = require("path");

const USER_FILE = path.join(
    __dirname,
    "..",
    "..",
    "data",
    "users.json"
);

const PREFERENCE_FILE = path.join(
    __dirname,
    "..",
    "..",
    "data",
    "preferences.json"
);

router.post("/signup", (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password required"
        });
    }

    const users = JSON.parse(
        fs.readFileSync("data/users.json", "utf8")
    );

    const existingUser = users.find(
        user => user.username === username
    );

    if (existingUser) {
        return res.status(400).json({
            message: "Username already exists"
        });
    }

    users.push({
        username,
        password
    });

    fs.writeFileSync(
        "data/users.json",
        JSON.stringify(users, null, 2)
    );

    res.json({
        message: "Signup successful"
    });

});
router.post("/login", (req, res) => {

    const { username, password } = req.body;

    const users = JSON.parse(
        fs.readFileSync("data/users.json", "utf8")
    );

    const user = users.find(
        user =>
            user.username === username &&
            user.password === password
    );

    if (!user) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    res.json({
        message: "Login successful"
    });

});



router.delete("/delete",(req,res)=>{

    const { username } = req.body;

    let users=JSON.parse(
        fs.readFileSync(USER_FILE,"utf8")
    );

    users=users.filter(
        u=>u.username!==username
    );

    fs.writeFileSync(
        USER_FILE,
        JSON.stringify(users,null,2)
    );

    let preferences=JSON.parse(
        fs.readFileSync(PREFERENCE_FILE,"utf8")
    );

    preferences=preferences.filter(
        u=>u.username!==username
    );

    fs.writeFileSync(
        PREFERENCE_FILE,
        JSON.stringify(preferences,null,2)
    );

    res.json({

        message:"Account deleted"

    });

});

module.exports = router;