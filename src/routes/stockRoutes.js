const express = require("express");
const fs = require("fs");

const router = express.Router();

router.get("/", (req, res) => {

  const stock = JSON.parse(
    fs.readFileSync(
      "data/stock.json",
      "utf8"
    )
  );

  res.json(stock);

});

module.exports = router;