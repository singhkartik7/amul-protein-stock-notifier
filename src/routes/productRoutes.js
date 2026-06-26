const express = require("express");
const fs = require("fs");

const router = express.Router();

router.get("/", (req, res) => {

  const products = JSON.parse(
    fs.readFileSync(
      "data/products.json",
      "utf8"
    )
  );

  res.json(products);

});

module.exports = router;