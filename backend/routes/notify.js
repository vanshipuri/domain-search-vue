const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_TLS === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// POST route to send notification email
router.post("/", async (req, res) => {
  const { domain, daysLeft, email } = req.body;

  if (!domain || !daysLeft || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    console.log(
      `Sending email to ${email} for domain ${domain} (${daysLeft} days left)`
    );

    await transporter.sendMail({
      from: '"Domain Tracker" ' + process.env.MAIL_FROM,
      to: email,
      subject: `Domain Expiry Alert for ${domain}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6">
          <h2>Domain Expiry Alert</h2>
          <p>Hello,</p>
          <p>Your domain <strong>${domain}</strong> will expire in <strong>${daysLeft} days</strong>.</p>
          <p>Please renew it soon to avoid service disruption.</p>
          <hr />
          <p style="color: grey; font-size: 0.9em">This is an automated email from your Domain Tracker system.</p>
        </div>
      `,
    });

    res.status(200).json({ message: "Email sent via SMTP!" });
  } catch (error) {
    console.error("SMTP email error:", error);
    res.status(500).json({ error: "SMTP email failed to send" });
  }
});

module.exports = router;
