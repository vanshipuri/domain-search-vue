const express = require("express");
const router = express.Router();

router.get("/privacy", function (req, res) {
  return res.send(`

    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy</title>
</head>
<body>

    <h2>Privacy Policy</h2>

    <p>This Privacy Policy explains how Domain Tracker handles information when you use our app.</p>

    <p><strong>We want to be clear: Domain Tracker is designed with your privacy in mind. We do not collect, store, or share any personal information that could identify you.</strong></p>

    <p>The only instance where we handle any user-provided information is if you choose to provide a <strong>non-specific email address</strong> for certain notifications. Here's what that means:</p>

    <ul>
        <li><strong>Notification Emails Only:</strong> If you opt-in to receive notifications, you may provide an email address. This email address is used solely for the purpose of sending you those specific notifications.</li>
        <li><strong>No Sharing with Third Parties:</strong> We will never share your email address with any third parties.</li>
    </ul>

    <p><strong>In summary, your privacy is paramount to us. Enjoy using Domain Tracker with the confidence that your personal information remains private.</strong></p>

</body>
</html>
    `);
});

router.get("/delete-my-account", function (req, res) {
  return res.send(`
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Delete Account</title>
</head>
<body>

    <h2>Delete Your Account</h2>

    <p>We're sorry to see you go! If you'd like to delete your account, please send an email to the address below:</p>

    <p><strong><a href="mailto:${process.env.CONTACT_EMAIL}">${process.env.CONTACT_EMAIL}</a></strong></p>

    <p>In your email, please include the following information to help us process your request:</p>
    <ul>
        <li>Your username associated with your account.</li>
        <li>A brief reason for your deletion request (optional, but helpful for us to improve).</li>
    </ul>

    <p>We will process your request as quickly as possible. Please note that it may take a few business days for your account to be fully deleted from our systems.</p>

    <p>If you have any questions or need assistance, feel delighted to reach out to us at the same email address.</p>

</body>
</html>
        `);
});

module.exports = router;
