const axios = require("axios");
require("dotenv").config();

const PANEL_URL = process.env.PANEL_URL;

const appApi = axios.create({
  baseURL: `${PANEL_URL}/api/application`,
  headers: {
    Authorization: `Bearer ${process.env.APP_API_KEY}`,
    Accept: "Application/vnd.pterodactyl.v1+json",
    "Content-Type": "application/json"
  },
  timeout: 15000
});

const clientApi = axios.create({
  baseURL: `${PANEL_URL}/api/client`,
  headers: {
    Authorization: `Bearer ${process.env.CLIENT_API_KEY}`,
    Accept: "Application/vnd.pterodactyl.v1+json",
    "Content-Type": "application/json"
  },
  timeout: 15000
});

module.exports = { appApi, clientApi };