const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/* ---------------------------
   STATIC FRONTEND
--------------------------- */

app.use(express.static(path.join(__dirname, "../frontend")));

/* ---------------------------
   ROUTES
--------------------------- */

const authRoutes = require("./routes/auth");
const serverRoutes = require("./routes/servers");
const userRoutes = require("./routes/users");

app.use("/api/auth", authRoutes);
app.use("/api/servers", serverRoutes);
app.use("/api/users", userRoutes);

/* ---------------------------
   FRONTEND PAGES
--------------------------- */

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dashboard.html"));
});

app.get("/servers", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/servers.html"));
});

/* ---------------------------
   HEALTH CHECK
--------------------------- */

app.get("/api/status", (req, res) => {
  res.json({
    status: "online",
    message: "Dashboard API running",
  });
});

/* ---------------------------
   START SERVER
--------------------------- */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("=================================");
  console.log("🚀 Dashboard running");
  console.log("🌐 http://localhost:" + PORT);
  console.log("=================================");
});