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
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const path = require("path");

// Initialize express app
const app = express();

const allowedOrigins = (
  process.env.CORS_ORIGIN || "http://localhost:3000,http://localhost:3001"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const isSameOrigin = (origin, req) => {
  if (!origin || !req.headers.host) return false;

  try {
    return new URL(origin).host === req.headers.host;
  } catch (error) {
    return false;
  }
};

const corsOptionsDelegate = (req, callback) => {
  const origin = req.headers.origin;
  const isAllowed =
    !origin ||
    process.env.NODE_ENV !== "production" ||
    allowedOrigins.includes(origin) ||
    isSameOrigin(origin, req);

  callback(null, {
    credentials: true,
    origin: isAllowed ? origin || true : false,
  });
};

// Middlewares
app.use(express.json({ limit: "10mb" })); // Body parser for JSON — tăng giới hạn để hỗ trợ ảnh Base64
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Body parser for urlencoded data

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // HTTP request logger
}

// Routes
app.use("/api", cors(corsOptionsDelegate)); // Allow Cross-Origin API requests
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/reservations", reservationRoutes);
app.use("/api/v1/tables", tableRoutes);
app.use("/api/v1/menu", menuRoutes);
app.use("/api/v1/combos", comboRoutes);
app.use("/api/v1/promotions", promotionRoutes);
app.use("/api/v1/settings", settingsRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/users", userRoutes);

// Base route for testing
if (process.env.NODE_ENV !== "production") {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.join(__dirname, "../../frontend/dist");

  app.use(express.static(frontendDistPath));

  app.get(/^\/(?!api(?:\/|$)).*/, (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;
