const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.BOT_TOKEN);

async function sendNotification(chatId, productName, currentStock) {
  await bot.sendMessage(
    chatId,
    `🚨 BACK IN STOCK

Product:
${productName}

Inventory:
${currentStock}`
  );
}

module.exports = {
  sendNotification,
};