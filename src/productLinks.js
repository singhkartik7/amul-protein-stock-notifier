function generateProductUrl(productName) {

    const slug = productName

        .toLowerCase()

        .replace(/\|/g, "-or-")

        .replace(/,/g, "")

        .replace(/\//g, "-")

        .replace(/\+/g, "-plus-")

        .replace(/&/g, "-and-")

        .replace(/\s+/g, "-")

        .replace(/[^a-z0-9-]/g, "")

        .replace(/-+/g, "-")

        .replace(/^-|-$/g, "");

    return `https://shop.amul.com/en/product/${slug}`;

}

module.exports = {

    generateProductUrl

};