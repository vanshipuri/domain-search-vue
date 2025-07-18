const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Tracked = require("../db/sqlite");
const repo = new Tracked();

// POST - Save per-user history
router.post("/history", auth, async (req, res) => {
  const username = req.user.username;
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    await repo.saveHistory(username, query);
    res.send({ message: "Saved" });
  } catch (err) {
    console.error("POST /history error:", err.message);
    res.status(500).json({ error: "Failed to save history" });
  }
});

// GET - Get per-user history
router.get("/history", auth, async (req, res) => {
  const username = req.user.username;

  try {
    const history = await repo.getHistoryByUser(username);
    res.send({ history });
  } catch (err) {
    console.error("GET /history error:", err.message);
    res.status(500).json({ error: "Failed to load history" });
  }
});

module.exports = router;
