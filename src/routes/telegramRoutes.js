const express = require("express");

const router = express.Router();

const {
    findUserByUsername
} = require("../models/userModel");

const {
    getPreferenceByUserId,
    savePreference
} = require("../models/preferenceModel");

router.post("/connect", async (req, res) => {

    try {

        const { username, chatId } = req.body;

        const user =
            await findUserByUsername(username);

        if (!user) {

            return res.status(404).json({

                message: "User not found"

            });

        }

        const preference =
            await getPreferenceByUserId(user.id);

        if (!preference) {

            return res.status(404).json({

                message: "Save preferences first"

            });

        }

        await savePreference(

            user.id,

            preference.pincode,

            chatId

        );

        res.json({

            message: "Telegram connected"

        });

    }
    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Server Error"

        });

    }

});

router.post("/disconnect", async (req, res) => {

    try {

        const { username } = req.body;

        const user =
            await findUserByUsername(username);

        if (!user) {

            return res.status(404).json({

                message: "User not found"

            });

        }

        const preference =
            await getPreferenceByUserId(user.id);

        if (!preference) {

            return res.status(404).json({

                message: "Preference not found"

            });

        }

        await savePreference(

            user.id,

            preference.pincode,

            null

        );

        res.json({

            message: "Telegram disconnected"

        });

    }
    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Server Error"

        });

    }

});

module.exports = router;