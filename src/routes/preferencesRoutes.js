const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth");
const {
    findUserByUsername
} = require("../models/userModel");

const {
    savePreference,
    getPreferenceByUserId,
    updateNotifyUntil,
    stopNotifications
} = require("../models/preferenceModel");

const {
    addTrackedProducts,
    deleteTrackedProducts,
    getTrackedProducts
} = require("../models/trackedProductModel");

// ========================================
// Helper Functions
// ========================================

async function getAuthenticatedUser(req, res) {

    const username = req.user.username;

    const user = await findUserByUsername(username);

    if (!user) {

        res.status(404).json({

            message: "User not found"

        });

        return null;

    }

    return user;

}

router.post("/", auth, async (req, res) => {

    try {

        const {

            pincode,

            selectedProducts

        } = req.body;
const username = req.user.username;

        const user =
            await findUserByUsername(username);

        if (!user) {

            return res.status(404).json({

                message: "User not found"

            });

        }

        const existing =
            await getPreferenceByUserId(user.id);

        const chatId =
            existing ? existing.chat_id : null;

        const preference =
            await savePreference(

                user.id,

                pincode,

                chatId

            );

        await deleteTrackedProducts(
            preference.id
        );

        await addTrackedProducts(

            preference.id,

            selectedProducts

        );

        res.json({

            message:
                "Preferences Saved Successfully"

        });

    }
    catch (err) {

        console.log(err);

        res.status(500).json({

            message:
                "Server Error"

        });

    }

});

router.get("/", auth, async (req, res) => {

    try {

        const username = req.user.username;

const user =
    await findUserByUsername(username);

        if (!user) {

            return res.json(null);

        }

        const preference =
            await getPreferenceByUserId(

                user.id

            );

        if (!preference) {

            return res.json(null);

        }

        const products =
            await getTrackedProducts(

                preference.id

            );

        res.json({

            username:
                user.username,

            pincode:
                preference.pincode,

            products,

            chatId:
                preference.chat_id,

            notifyUntil:
                preference.notify_until

        });

    }
    catch (err) {

        console.log(err);

        res.status(500).json({

            message:
                "Server Error"

        });

    }

});

router.post("/reset", auth, async (req, res) => {

    try {

        const username = req.user.username;

const user =
    await findUserByUsername(
        username
    );


        if (!user) {

            return res.status(404).json({

                message:
                    "User not found"

            });

        }

        const preference =
            await getPreferenceByUserId(
                user.id
            );

        if (!preference) {

            return res.status(404).json({

                message:
                    "Preference not found"

            });

        }

        await savePreference(

            user.id,

            "",

            preference.chat_id

        );

        await deleteTrackedProducts(

            preference.id

        );
        await stopNotifications(

            user.id

        );

        res.json({

            message:
                "Preferences reset"

        });

    }
    catch (err) {

        console.log(err);

        res.status(500).json({

            message:
                "Server Error"

        });

    }

});

router.post("/notifications/start", auth, async (req, res) => {

    try {

        const { days } = req.body;

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
        const preference =
    await getPreferenceByUserId(user.id);

if (!preference || !preference.pincode) {

    return res.status(400).json({

        message: "Please save your preferences before enabling notifications."

    });

}

if (!preference.chat_id) {

    return res.status(400).json({

        message: "Please connect your Telegram account first."

    });

}

const products =
    await getTrackedProducts(
        preference.id
    );

if (products.length === 0) {

    return res.status(400).json({

        message: "Please save your preferences before enabling notifications."

    });

}
        const notifyUntil = new Date(

            Date.now() +

            days * 24 * 60 * 60 * 1000

        );

        await updateNotifyUntil(

            user.id,

            notifyUntil

        );

        res.json({

            message: "Notifications activated"

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Server Error"

        });

    }

});


router.post("/notifications/stop", auth, async (req, res) => {

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

        await stopNotifications(

            user.id

        );

        res.json({

            message: "Notifications stopped"

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