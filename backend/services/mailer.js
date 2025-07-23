const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_TLS === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

module.exports = {
  /**
   * Draft and send an email for an expiring domain.
   * @param {string} email
   * @param {string} domain
   * @param {number|string} daysLeft
   */
  async sendDomainExpiryMail(email, domain, daysLeft) {
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
  },
};
