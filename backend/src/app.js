const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const tableRoutes = require("./routes/tableRoutes");
const menuRoutes = require("./routes/menuRoutes");
const comboRoutes = require("./routes/comboRoutes");
const promotionRoutes = require("./routes/promotionRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

// Initialize express app
const app = express();

// Middlewares
app.use(cors()); // Allow Cross-Origin requests
app.use(express.json({ limit: "10mb" })); // Body parser for JSON — tăng giới hạn để hỗ trợ ảnh Base64
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Body parser for urlencoded data

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // HTTP request logger
}

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/reservations", reservationRoutes);
app.use("/api/v1/tables", tableRoutes);
app.use("/api/v1/menu", menuRoutes);
app.use("/api/v1/combos", comboRoutes);
app.use("/api/v1/promotions", promotionRoutes);
app.use("/api/v1/settings", settingsRoutes);
app.use("/api/v1/reviews", reviewRoutes);

// Base route for testing
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;
