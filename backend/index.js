const express = require("express");
const cors = require("cors");
require("dotenv").config();

const whoisapi = require("./routes/whoisapi");
const trackedRoutes = require("./routes/tracked");
const notifyRoutes = require("./routes/notify");
const runDailyNotifier = require("./cron/notifyCron");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/track", trackedRoutes);
app.use("/api/whois", whoisapi);
app.use("/api/notify", notifyRoutes);


runDailyNotifier();


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
