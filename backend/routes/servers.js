const express = require("express");
const { appApi, clientApi } = require("../config/pterodactyl");

const router = express.Router();

// List servers
router.get("/", async (req, res) => {
  try {
    const response = await appApi.get("/servers");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch servers",
      details: error.response?.data || error.message
    });
  }
});

// Create server
router.post("/", async (req, res) => {
  try {
    const {
      name,
      user,
      egg,
      docker_image,
      startup,
      environment,
      limits,
      feature_limits,
      allocation,
      node
    } = req.body;

    const response = await appApi.post("/servers", {
      name,
      user,
      egg,
      docker_image,
      startup,
      environment,
      limits,
      feature_limits,
      allocation,
      node
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: "Failed to create server",
      details: error.response?.data || error.message
    });
  }
});

// Power actions
router.post("/:identifier/power", async (req, res) => {
  try {
    const { signal } = req.body;

    await clientApi.post(`/servers/${req.params.identifier}/power`, {
      signal
    });

    res.json({ success: true, message: `Server ${signal} command sent` });
  } catch (error) {
    res.status(500).json({
      error: "Failed to send power action",
      details: error.response?.data || error.message
    });
  }
});

// Live resources
router.get("/:identifier/resources", async (req, res) => {
  try {
    const response = await clientApi.get(`/servers/${req.params.identifier}/resources`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch resources",
      details: error.response?.data || error.message
    });
  }
});

// Console websocket info
router.get("/:identifier/console", async (req, res) => {
  try {
    const response = await clientApi.get(`/servers/${req.params.identifier}/websocket`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch console websocket",
      details: error.response?.data || error.message
    });
  }
});

// List subusers
router.get("/:identifier/access", async (req, res) => {
  try {
    const response = await clientApi.get(`/servers/${req.params.identifier}/users`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch access list",
      details: error.response?.data || error.message
    });
  }
});

// Add subuser access
router.post("/:identifier/access", async (req, res) => {
  try {
    const { email, permissions } = req.body;

    const response = await clientApi.post(`/servers/${req.params.identifier}/users`, {
      email,
      permissions
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: "Failed to add access",
      details: error.response?.data || error.message
    });
  }
});

// Remove subuser access
router.delete("/:identifier/access/:subuserUuid", async (req, res) => {
  try {
    await clientApi.delete(
      `/servers/${req.params.identifier}/users/${req.params.subuserUuid}`
    );

    res.json({ success: true, message: "Access removed" });
  } catch (error) {
    res.status(500).json({
      error: "Failed to remove access",
      details: error.response?.data || error.message
    });
  }
});

module.exports = router;