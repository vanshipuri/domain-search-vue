const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config();

const Tracked = require('../db/sqlite');
const repo = new Tracked(); //  Initialize repo

const SECRET_KEY = process.env.JWT_SECRET || "your_fallback_secret"; // Optional fallback

// REGISTER
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  console.log("Incoming register:", { username, email, password });

  if (!username || !email || !password) {
    console.log(" Missing fields");
    return res.status(400).json({ error: "All fields are required" });
  }

  const existingUser = repo.getUserByUsername(username);
  if (existingUser) {
    console.log(" User already exists:", username);
    return res.status(409).json({ error: "User already exists" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    repo.createUser(username, email, hashedPassword);
    console.log(" User registered:", username);
    return res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(" Error inserting user:", err.message);
    return res.status(500).json({ error: "Error creating user" });
  }
});


//  LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("🟡 Login request for:", username);

  const user = repo.getUserByUsername(username);
  console.log("🔍 Found user:", user);

  if (!user) {
    console.log("❌ User not found");
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.password);
  console.log("🧪 Password match:", match);

  if (!match) {
    console.log("❌ Password does not match");
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
    expiresIn: "1h",
  });

  console.log("✅ Login successful, token sent");
  res.json({ token });
});


// ✅ Protected route example
router.get("/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ user: decoded });
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
});

module.exports = router;

