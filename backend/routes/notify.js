const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

//Mailpit SMTP transporter
const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
  secure: false, 
});

//POST route to send notification email
router.post("/", async (req, res) => {
  const { domain, daysLeft, email} = req.body;

    if (!domain || !daysLeft || !email) {
    return res.status(400).json({ error: "Missing required fields" });
    }

  try {
    console.log(`Preparing to send mail to ${email} for domain ${domain}, ${daysLeft} days left`);
 
    await transporter.sendMail({
      from: '"Domain Tracker" <admin@domaintracker.com>',
      to: email,
      subject: `Domain Expiry Alert for ${domain}`,
      text: `Your domain ${domain} expires in ${daysLeft} days. Please renew it.`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6">
          <h2> Domain Expiry Alert</h2>
          <p>Hello,</p>
          <p>Your domain <strong>${domain}</strong> will expire in <strong>${daysLeft} days</strong>.</p>
          <p>Please renew it soon to avoid service disruption.</p>
          <hr />
          <p style="color: grey; font-size: 0.9em">This is an automated email from your Domain Tracker system.</p>
        </div>
      `,
    });

    res.status(200).json({ message: "Email sent!" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Email sending failed" });
  }
});

//Mailpit Working Check 
router.get("/test", async (req, res) => {
    try {
        await transporter.sendMail({
        from: '"Test Mailer" <test@example.com>',
      to: "test@example.com",
      subject: "Test Email from Domain Tracker",
      text: "This is a test email from the backend route.",
      html: "<h3>This is a <span style='color:green;'>test email</span> sent via Mailpit !!!</h3>",
    });

    res.send(" Test email sent! Check Mailpit.");
  } catch (error) {
    console.error(" Test email error:", error);
    res.status(500).send(" Test email failed.");
  }
});
  

module.exports = router;