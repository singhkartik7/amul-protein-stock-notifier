async function shouldNotify(
  product,
  previousStock,
  sendNotification,
  chatId,
  pincode
) {
  const currentStock = product.inventory_quantity;

  if (!previousStock[pincode]) {

    previousStock[pincode] = {};

}

const previous =
    previousStock[pincode][product.name] || 0;

  if (
    currentStock > 0 &&
    currentStock !== previous
  ) {

    await sendNotification(
      chatId,
      product.name,
      currentStock
    );

    console.log("Notification Sent");
  }

  previousStock[pincode][product.name] =
    currentStock;
}

module.exports = {
  shouldNotify,
};