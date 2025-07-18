const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config();

const Tracked = require('../db/sqlite');
const repo = new Tracked();

const SECRET_KEY = process.env.JWT_SECRET || "your_fallback_secret"; // Optional fallback

//login or register user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("Login request for:", username);

  try {
    const user = repo.getUserByUsername(username);
    console.log("Found user:", user);

    if (user) {
      const match = await bcrypt.compare(password, user.password);
      console.log("Password match:", match);

      if (match) {
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
          expiresIn: "1h",
        });
        console.log("Login successful, token sent");
        return res.json({ token });
      } else {
        console.log("Password does not match");
        return res.status(409).json({ error: "Username already exists. Please choose a different one." });
      }
    }

    // If user doesn't exist, register
    const hashedPassword = await bcrypt.hash(password, 10);
    repo.createUser(username, "", hashedPassword);
    console.log("User registered:", username);

    const newUser = repo.getUserByUsername(username);
    const token = jwt.sign({ id: newUser.id, username: newUser.username }, SECRET_KEY, {
      expiresIn: "1h",
    });
    console.log("Registration successful, token sent");
    res.json({ token });

  } catch (err) {
    console.error("Login/Register error:", err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});


//  Protected route example
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

