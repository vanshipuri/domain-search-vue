const express = require('express');
const verifyToken = require('../middlewares/auth');
const router = express.Router();

// Example protected route
router.get('/me', verifyToken, (req, res) => {
  res.json({ message: 'Protected data', user: req.user });
});

module.exports = router;
