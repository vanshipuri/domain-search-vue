const express = require("express");
const Tracked = require("../db/sqlite");
const router = express.Router();
const repo = new Tracked();
const auth = require("../middlewares/auth");

// GET all tracked domains for logged-in user
router.get("/", auth, (req, res) => {
  try {
    const userId = req.user.id;
    const data = repo.getAllByUser(userId);
    res.json(data);
  } catch (err) {
    console.error("Failed to fetch domains:", err.message);
    res.status(500).json({ error: "Failed to fetch tracked domains" });
  }
});

//  POST a new domain for the current user
router.post("/", auth, (req, res) => {
  const userId = req.user.id;
  const { domain, email, expiryDate, notified } = req.body;

  console.log(
    "Saving domain for user:",
    userId,
    "Domain:",
    domain,
    "body:",
    req.body
  );

  if (!domain || !expiryDate) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    repo.saveDomainForUser(
      userId,
      domain,
      email || "N/A",
      expiryDate,
      notified ? 1 : 0,
      null
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save domain" });
  }
});

// DELETE a domain for current user
router.delete("/:domain", auth, (req, res) => {
  const userId = req.user.id;
  const domain = req.params.domain;

  try {
    repo.deleteTrackedDomain(userId, domain);
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to delete domain:", err.message);
    res.status(500).json({ error: "Failed to delete domain" });
  }
});

// PATCH email or notifiedDays for current user
router.patch("/email", auth, async (req, res) => {
  const { domain, email, notifyDays } = req.body;
  const userId = req.user.id;

  console.log("/email", domain, email, notifyDays, userId);

  if (!domain) {
    return res.status(400).json({ error: "Domain is required" });
  }

  try {
    if (email !== undefined) {
      await repo.updateTrackedEmail(userId, domain, email);
      console.log("Updated email to ", email);
    }
    if (notifyDays !== undefined) {
      const notifyDaysText = Array.isArray(notifyDays)
        ? notifyDays.join(",")
        : notifyDays;
      await repo.updateTrackedNotifyDays(userId, domain, notifyDaysText);
      console.log(
        "Updated notifyDays to ",
        notifyDays,
        " as text ",
        notifyDaysText
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to update domain:", err.message);
    res.status(500).json({ error: "Failed to update domain details" });
  }
});

module.exports = router;
