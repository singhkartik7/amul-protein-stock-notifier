const axios = require("axios");

async function getProducts() {
  const response = await axios.get(
    "YOUR_AMUL_URL_HERE"
  );

  return response.data.data;
}

module.exports = { getProducts };