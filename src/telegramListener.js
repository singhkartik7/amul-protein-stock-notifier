require("dotenv").config();
const axios = require("axios");

const TelegramBot = require("node-telegram-bot-api");
console.log("Telegram listener started");
const bot = new TelegramBot(
    process.env.BOT_TOKEN,
    {
        polling: true
    }
);
const API_URL = "http://localhost:3001";
bot.onText(/^\/start(?:\s+(.+))?$/, async (msg, match) => {

    const chatId = msg.chat.id;

    const username = match[1];

    console.log("Chat ID:", chatId);

    console.log("Username:", username);

    if (!username) {

        bot.sendMessage(
            chatId,
            "Please connect from the dashboard."
        );

        return;

    }

    try {

        await axios.post(
            `${API_URL}/telegram/connect`,
            {
                username,
                chatId
            }
        );

        bot.sendMessage(
            chatId,
            "✅ Telegram connected successfully!"
        );

    }
    catch (err) {

        console.log(err.message);

        bot.sendMessage(
            chatId,
            "❌ Failed to connect."
        );

    }

});