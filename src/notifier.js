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

        `${pincode}|${product._id}`;

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

        pincode,

        currentStock

    );

}

module.exports = {

    shouldNotify

};