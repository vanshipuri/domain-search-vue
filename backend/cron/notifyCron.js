const Repository = require("../db/sqlite");
const axios = require("axios");
const cron = require("node-cron");

const repository = new Repository();

function computeDaysLeft(expiryDate) {
  if (!expiryDate) return null;
  const today = new Date();
  const expiry = new Date(expiryDate);
  if (isNaN(expiry)) return null;
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 ? diffDays : null;
}

async function notifyUser(item) {
  const notifyDays = (item.notifyDaysInput || "")
    .split(",")
    .map((d) => parseInt(d.trim()))
    .filter((d) => !isNaN(d));

  for (const day of notifyDays) {
    if (
      item.daysLeft === day &&
      Array.isArray(item.notifiedDays) &&
      !item.notifiedDays.includes(day) &&
      item.email &&
      item.email !== "N/A"
    ) {
      console.log(
        `Sending email: Domain "${item.domain}" expires in ${day} days. Notify ${item.email}`
      );

      try {
        await axios.post("http://localhost:5000/api/notify", {
          domain: item.domain,
          daysLeft: day,
          email: item.email,
        });

        // Update notifiedDays in DB
        const updateNotified = Array.from(
          new Set([...(item.notifiedDays || []), day])
        );
        await repository.updateNotifiedDays(item.domain, updateNotified);

        console.log(`Notified ${item.email} for domain ${item.domain}`);
      } catch (error) {
        console.error(" Failed to send email:", error.message);
      }
    }
  }
}

function runDailyNotifier() {
  // Run daily at 9 AM
  cron.schedule("0 9 * * *", async () => {
    console.log("Running daily notifier (9AM)");

    try {
      const domains = await repository.getAll();

      for (let item of domains) {
        const daysLeft = computeDaysLeft(item.expiryDate);
        if (daysLeft !== null) {
          item.daysLeft = daysLeft;
          await notifyUser(item);
        }
      }

      console.log("Daily notifier completed successfully.");
    } catch (error) {
      console.error("Error in daily notifier:", error.message);
    }
  });
}

module.exports = runDailyNotifier;
