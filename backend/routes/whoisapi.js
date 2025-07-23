const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");
require("dotenv").config();

const router = express.Router();
const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour TTL

console.log("API KEY from env:", process.env.WHOIS_API_KEY);

// GET 
router.get("/", async (req, res) => {
  const domain = req.query.domain?.toLowerCase();
  const apiKey = process.env.WHOIS_API_KEY;

  if (!domain) {
    return res.status(400).json({ error: "Domain is required" });
  }

 
  const cachedData = cache.get(domain);
  if (cachedData) {
    console.log(`Cache hit for ${domain}`);
    return res.json(cachedData);
  }

  try {
    const response = await axios.get("https://www.whoisxmlapi.com/whoisserver/WhoisService", {
      params: {
        apiKey,
        domainName: domain,
        outputFormat: "JSON"
      }
    });

    const data = response.data;

   
    cache.set(domain, data);
    console.log(`Cache miss for ${domain}. Fetched from API.`);

    res.json(data);
  } catch (error) {
    console.error("Whois API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch domain data" });
  }

  console.log("API Key:", apiKey);
  console.log("Domain:", domain);
});

module.exports = router;

