const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const FILE = path.join(
    __dirname,
    "..",
    "..",
    "data",
    "preferences.json"
);

router.post("/connect", (req, res) => {

    const { username, chatId } = req.body;

    const users = JSON.parse(
        fs.readFileSync(FILE, "utf8")
    );

    const user = users.find(
        u => u.username === username
    );

    if (!user) {

        return res.status(404).json({
            message: "User not found"
        });

    }

    user.chatId = chatId;

    fs.writeFileSync(
        FILE,
        JSON.stringify(users, null, 2)
    );

    res.json({
        message: "Telegram connected"
    });

});


router.post("/disconnect", (req, res) => {

    const { username } = req.body;

    const users = JSON.parse(
        fs.readFileSync(FILE, "utf8")
    );

    const user = users.find(
        u => u.username === username
    );

    if (!user) {

        return res.status(404).json({
            message: "User not found"
        });

    }

    user.chatId = null;

    fs.writeFileSync(
        FILE,
        JSON.stringify(users, null, 2)
    );

    res.json({
        message: "Telegram disconnected"
    });

});


module.exports = router;