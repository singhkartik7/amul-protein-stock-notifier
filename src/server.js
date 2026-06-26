const express = require("express");

const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const stockRoutes = require("./routes/stockRoutes");
const productRoutes = require("./routes/productRoutes");
const healthRoutes = require("./routes/healthRoutes");
app.use(express.json());
const authRoutes = require("./routes/authRoutes");
const preferencesRoutes = require("./routes/preferencesRoutes");
const { startStockChecker } = require("./index");

const telegramRoutes =
require("./routes/telegramRoutes");
startStockChecker();
require("./telegramListener");
app.use("/telegram", telegramRoutes);




app.use("/preferences", preferencesRoutes);

// Stock API
app.use("/stock", stockRoutes);

// Products API
app.use("/products", productRoutes);

// Health API
app.use("/health", healthRoutes);
app.use("/auth", authRoutes);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

