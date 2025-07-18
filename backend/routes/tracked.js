const express = require("express");
const Tracked = require("../db/sqlite");
const router = express.Router();
const repo = new Tracked();
const auth = require("../middlewares/auth");

// GET all tracked domains for logged-in user
router.get("/", auth, (req, res) => {
  try {
    const username = req.user.username;
    const data = repo.getAllByUser(username);
    res.json(data);
  } catch (err) {
    console.error("Failed to fetch domains:", err.message);
    res.status(500).json({ error: "Failed to fetch tracked domains" });
  }
});

//  POST a new domain for the current user
router.post("/", auth, (req, res) => {
  const username = req.user.username;
  const { domain, email, expiryDate, notified, notifiedDays } = req.body;

  console.log("Saving domain for user:", username, "Domain:", domain, 'body:', req.body);

  if (!domain || !expiryDate) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
       repo.saveDomainForUser(username, domain, email || "N/A", expiryDate, notified ? 1 : 0, notifiedDays || []);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save domain" });
  }
});

// DELETE a domain for current user
router.delete("/:domain", auth, (req, res) => {
  const username = req.user.username;
  const domain = req.params.domain;

  try {
    repo.deleteTrackedDomain(username, domain);
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to delete domain:", err.message);
    res.status(500).json({ error: "Failed to delete domain" });
  }
});

// PATCH email or notifiedDays for current user
router.patch("/email", auth, (req, res) => {
  const username = req.user.username;
  const { domain, email, notifiedDays = [] } = req.body;

  if (!domain) {
    return res.status(400).json({ error: "Domain is required" });
  }

  try {
    repo.updateTrackedEmailOrNotify(username, domain, email, notifiedDays);
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to update domain:", err.message);
    res.status(500).json({ error: "Failed to update domain details" });
  }
});

module.exports = router;

