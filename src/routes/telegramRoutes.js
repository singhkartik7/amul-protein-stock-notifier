const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth");

const {

    findUserByEmail,

    findUserByTelegramToken,

    saveTelegramToken,

    generateTelegramToken

} = require("../models/userModel");

const {
    getPreferenceByUserId,
    savePreference
} = require("../models/preferenceModel");
// ========================================
// Telegram Link
// ========================================

router.get(

    "/link",

    auth,

    async (req, res) => {

        try {

            const email =

                req.user.email;

            const user =

                await findUserByEmail(

                    email

                );

            if (!user) {

                return res.status(404).json({

                    message: "User not found"

                });

            }

            let token =

                user.telegram_token;

            if (!token) {

                token =

                    generateTelegramToken();

                await saveTelegramToken(

                    user.id,

                    token

                );

            }

            res.json({

                link:

`https://t.me/Amul_Protein_Stock_Notifier_Bot?start=${token}`

            });

        }

        catch (err) {

            console.log(err);

            res.status(500).json({

                message: "Server Error"

            });

        }

    }

);
router.post("/connect", async (req, res) => {

    try {

       const { token, chatId } = req.body;

const user =
    await findUserByTelegramToken(token);

        if (!user) {

            return res.status(404).json({

                message: "Invalid Telegram Link"

            });

        }

        const preference =
            await getPreferenceByUserId(user.id);

        if (!preference) {

            return res.status(404).json({

                message: "Please save your preferences first."

            });

        }

        await savePreference(

            user.id,

            preference.pincode,

            chatId

        );

        res.json({

            message: "Telegram connected successfully."

        });

    }
    catch (err) {
console.error("=== TELEGRAM CONNECT ERROR ===");
    console.error(err.message);

    if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Data:", err.response.data);
    }

    console.error(err.stack);

    res.status(500).json({
        message: err.message
    });
}

});

router.post("/disconnect", auth, async (req, res) => {

    try {

        const email = req.user.email;

        const user =
            await findUserByEmail(email);

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

            message: "Telegram disconnected successfully."

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