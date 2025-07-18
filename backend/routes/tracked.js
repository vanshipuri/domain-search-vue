const express = require("express");
const Tracked = require("../db/sqlite");
const router = express.Router();
const repo = new Tracked();
const auth = require("../middlewares/auth"); 


// GET all tracked domains
router.get("/", (req, res) => {
  try {
    const data = repo.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tracked domains" });
  }
});

// POST a new domain to track
router.post("/", (req, res) => {
  const { domain, email, expiryDate, notified } = req.body;
  if (!domain || !expiryDate) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    repo.save(domain, email || "N/A", expiryDate, notified ? 1 : 0);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save domain" });
  }
});


// DELETE a domain from tracking
router.delete("/:domain", (req, res) => {
  try {
    repo.delete(req.params.domain);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete domain" });
  }
});

// PATCH update email and optionally notifiedDays
router.patch("/email", (req, res) => {
  const { domain, email, notifiedDays } = req.body;

  if (!domain) {
    return res.status(400).json({ error: "Domain is required" });
  }

  try {
    if (email) repo.updateEmail(domain, email);
    if (Array.isArray(notifiedDays)) repo.updateNotifiedDays(domain, notifiedDays);

    res.json({ success: true });
  } catch (err) {
    console.error("Error updating domain:", err.message);
    res.status(500).json({ error: "Failed to update domain details" });
  }
});

module.exports = router;

