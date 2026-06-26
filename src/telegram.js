const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.BOT_TOKEN);

async function sendNotification(chatId, productName, currentStock) {
  try {
    await bot.sendMessage(
      chatId,
      `🚨 BACK IN STOCK

Product:
${productName}

Inventory:
${currentStock}`
    );

    console.log("Telegram notification sent.");
  } catch (err) {
    console.error(err.response?.body || err);
  }
}

module.exports = {
  sendNotification,
};

