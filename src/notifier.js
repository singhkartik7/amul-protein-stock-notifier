const {

    saveStock

} = require("./models/stockModel");

async function shouldNotify(

    product,

    stockMap,

    sendNotification,

    chatId,

    pincode

) {

    const key =

        `${pincode}|${product.name}`;

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

            product.name,

            currentStock

        );

        console.log(

            `Notification sent for ${product.name}`

        );

    }

    stockMap.set(

        key,

        currentStock

    );

    await saveStock(

        product.name,

        pincode,

        currentStock

    );

}

module.exports = {

    shouldNotify

};