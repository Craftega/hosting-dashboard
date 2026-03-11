const axios = require("axios")
require("dotenv").config()

module.exports = axios.create({
 baseURL: process.env.PANEL_URL + "/api/application",
 headers:{
  Authorization:`Bearer ${process.env.PTERO_KEY}`,
  Accept:"Application/vnd.pterodactyl.v1+json",
  "Content-Type":"application/json"
 }
})