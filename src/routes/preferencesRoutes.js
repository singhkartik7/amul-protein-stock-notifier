const express = require("express");

const router = express.Router();
const path = require("path");

const FILE = path.join(
    __dirname,
    "..",
    "..",
    "data",
    "preferences.json"
);

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




router.post("/reset", (req,res)=>{

    const { username } = req.body;

    const preferences = JSON.parse(
        fs.readFileSync(FILE,"utf8")
    );

    const user = preferences.find(
        u=>u.username===username
    );

    if(!user){

        return res.status(404).json({
            message:"User not found"
        });

    }

    user.pincode="";

    user.products=[];

    fs.writeFileSync(
        FILE,
        JSON.stringify(preferences,null,2)
    );

    res.json({
        message:"Preferences reset"
    });

});

module.exports = router;