const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const preferencesRoutes = require("./routes/preferencesRoutes");
const productRoutes = require("./routes/productRoutes");
const telegramRoutes = require("./routes/telegramRoutes");
const directFlowTest = require("./routes/directFlowTest");
const { startStockChecker } = require("./index");

require("./telegramListener");
//startStockChecker();

app.use("/auth", authRoutes);
app.use("/preferences", preferencesRoutes);
app.use("/products", productRoutes);
app.use("/telegram", telegramRoutes);
app.use("/test-direct-flow", directFlowTest);
app.get("/", (req, res) => {

    res.json({

        message: "Amul Stock Notifier Backend API",
        status: "Running",
        health: "/health"

    });

});

app.get("/health", (req, res) => {

    res.status(200).json({

        status: "OK",
        message: "Amul Stock Backend is running",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()

    });

});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});