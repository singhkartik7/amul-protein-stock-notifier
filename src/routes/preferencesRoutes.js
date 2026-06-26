const express = require("express");

const router = express.Router();

const fs = require("fs");

router.post("/", (req, res) => {

    const {

        username,

        pincode,

        selectedProducts

    } = req.body;

    const preferences = JSON.parse(

        fs.readFileSync(

            "data/preferences.json",

            "utf8"

        )

    );

    const existingUser = preferences.findIndex(

        user => user.username === username

    );

    const existing = preferences.find(
    user => user.username === username
);

const newPreference = {

    username,

    pincode,

    products: selectedProducts,

    chatId: existing?.chatId

};

    if (existingUser !== -1) {

        preferences[existingUser] = newPreference;

    } else {

        preferences.push(newPreference);

    }

    fs.writeFileSync(

        "data/preferences.json",

        JSON.stringify(preferences, null, 2)

    );

    res.json({

        message: "Preferences Saved Successfully"

    });

});

router.get("/:username", (req, res) => {

    const preferences = JSON.parse(
        fs.readFileSync(
            "data/preferences.json",
            "utf8"
        )
    );

    const user = preferences.find(
        u => u.username === req.params.username
    );

    if (!user) {
        return res.json(null);
    }

    res.json(user);

});


module.exports = router;