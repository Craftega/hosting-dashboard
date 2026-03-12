const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authMiddleware = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const serverRoutes = require("./routes/servers");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../frontend")));

app.use("/api/auth", authRoutes);
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/servers", authMiddleware, serverRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dashboard.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Dashboard running on port ${PORT}`);
});