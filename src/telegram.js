const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.BOT_TOKEN);

async function sendNotification(

    chatId,

    product,

    pincode

) {

    try {

        const parts = product.name.split(",");

const productTitle = parts[0];

const productDetails = parts

                .slice(1)

                .join(",")

                .trim();

        const message = `
🚨 <b>Stock Alert!</b>

📦 <b>${productTitle}</b>
${productDetails}

📍 Pincode - <b>${pincode}</b>

📦 Available Quantity - <b>${product.inventory_quantity}</b>

🛒 <a href="${product.url}"><b>Buy Now</b></a>
`;

        await bot.sendMessage(

            chatId,

            message,

            {

                parse_mode: "HTML",

                disable_web_page_preview: true

            }

        );

        console.log(

            "Telegram notification sent."

        );

    }

    catch (err) {

    if (err.response?.body?.error_code === 401) {

        console.log("❌ Invalid Telegram Bot Token");

        return;

    }

    console.error(err);

}

}

module.exports = {

    sendNotification

};