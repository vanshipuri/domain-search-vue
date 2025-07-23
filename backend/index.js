const express = require("express");
const cors = require("cors");
require("dotenv").config();

const whoisapi = require("./routes/whoisapi");
const noticeRoutes = require("./routes/notices");
const trackedRoutes = require("./routes/tracked");
const notifyRoutes = require("./routes/notify");
const runDailyNotifier = require("./cron/notifyCron");
const authRoutes = require("./routes/auth");
const historyRoutes = require("./routes/history");
const protectedRoutes = require("./routes/protected");

const app = express();
const PORT = Number.parseInt(process.env.APP_PORT || 5000);

app.use(cors());
app.use(express.json());

app.use("/", noticeRoutes);
app.use("/api/track", trackedRoutes);
app.use("/api/whois", whoisapi);
app.use("/api/notify", notifyRoutes);
app.use("/api", authRoutes);
app.use("/api", historyRoutes);
app.use("/api", protectedRoutes);

runDailyNotifier();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
