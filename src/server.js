const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const preferencesRoutes = require("./routes/preferencesRoutes");
const productRoutes = require("./routes/productRoutes");
const telegramRoutes = require("./routes/telegramRoutes");

const { startStockChecker } = require("./index");

require("./telegramListener");
startStockChecker();

app.use("/auth", authRoutes);
app.use("/preferences", preferencesRoutes);
app.use("/products", productRoutes);
app.use("/telegram", telegramRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});