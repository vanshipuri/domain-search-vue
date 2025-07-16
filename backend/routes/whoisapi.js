const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();
console.log("🔑 API KEY from env:", process.env.WHOIS_API_KEY);
// GET /api/whois
router.get("/", async (req, res) => {
  const domain = req.query.domain;
  const apiKey = process.env.WHOIS_API_KEY;

  if (!domain) {
    return res.status(400).json({ error: "Domain is required" });
  }

  try {
    const response = await axios.get("https://www.whoisxmlapi.com/whoisserver/WhoisService", {
      params: {
        apiKey,
        domainName: domain,
        outputFormat: "JSON"
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error("Whois API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch domain data" });
  }

  console.log("API Key:", apiKey);
console.log("Domain:", domain);
});

module.exports = router;

