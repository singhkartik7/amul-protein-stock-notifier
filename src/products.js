const {
    generateProductUrl
} = require("./productLinks");
async function processProducts(

    data,

    users,

    stockMap,

    sendNotification,

    shouldNotify,

    pincode

) {

    let productsFound = 0;

    if (!data.data) {

        return productsFound;

    }

    for (const product of data.data) {

        for (const user of users) {

            if (!user.products.includes(product.name)) {

                continue;

            }

            productsFound++;

            
            product.url = generateProductUrl(product.name);



            await shouldNotify(

                product,

                stockMap,

                sendNotification,

                user.chatId,

                pincode

            );

        }

    }

    return productsFound;

}

module.exports = {

    processProducts

};