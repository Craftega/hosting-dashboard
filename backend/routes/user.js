const express = require("express");
const { appApi } = require("../config/pterodactyl");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await appApi.get("/users");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch users",
      details: error.response?.data || error.message
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { email, username, first_name, last_name, password } = req.body;

    const response = await appApi.post("/users", {
      email,
      username,
      first_name,
      last_name,
      password
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: "Failed to create user",
      details: error.response?.data || error.message
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await appApi.delete(`/users/${req.params.id}`);
    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete user",
      details: error.response?.data || error.message
    });
  }
});

module.exports = router;