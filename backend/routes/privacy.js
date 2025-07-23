const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
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

module.exports = router;
