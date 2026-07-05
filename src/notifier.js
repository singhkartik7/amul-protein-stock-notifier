const {
    saveStock
} = require("./models/stockModel");

async function shouldNotify(

    product,

    stockMap,

    sendNotification,

    chatId,

    pincode,

    storeId

) {

    const key =
        `${storeId}|${product._id}`;

    const currentStock =
        product.inventory_quantity;

    const previousStock =
        stockMap.has(key)
            ? stockMap.get(key)
            : 0;

    if (

        currentStock > 0 &&
        currentStock !== previousStock

    ) {

        await sendNotification(

            chatId,

            product,

            pincode

        );

    }

    stockMap.set(

        key,

        currentStock

    );

    await saveStock(

        product._id,

        storeId,

        currentStock

    );

}

module.exports = {

    shouldNotify

};