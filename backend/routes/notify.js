const express = require("express");
const mailer = require("../services/mailer");

const router = express.Router();

// POST route to send notification email
router.post("/", async (req, res) => {
  if (process.env.BLOCK_DIRECT_NOTIFY) {
    return res.status(404);
  }

  const { domain, daysLeft, email } = req.body;

  if (!domain || !daysLeft || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    console.log(
      `Sending email to ${email} for domain ${domain} (${daysLeft} days left)`
    );

    await mailer.sendDomainExpiryMail(email, domain, daysLeft);

    res.status(200).json({ message: "Email sent via SMTP!" });
  } catch (error) {
    console.error("SMTP email error:", error);
    res.status(500).json({ error: "SMTP email failed to send" });
  }
});

module.exports = router;
