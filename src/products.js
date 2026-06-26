async function processProducts(
    data,
    targets,
    previousStock,
    sendNotification,
    chatId,
    pincode,
    shouldNotify
) {

  let productsFound = 0;

  if (!data.data) {
    return productsFound;
  }

  const targetNames = new Set(targets);

  for (const product of data.data) {

    if (targetNames.has(product.name)) {

      productsFound++;

      console.log(
        product.name,
        "Inventory:",
        product.inventory_quantity
      );

      await shouldNotify(
    product,
    previousStock,
    sendNotification,
    chatId,
    pincode
);

    }
  }

  return productsFound;
}

module.exports = {
  processProducts,
};