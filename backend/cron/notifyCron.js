const Repository = require("../db/sqlite");
const axios = require("axios");
const cron = require("node-cron");

const mailer = require("../services/mailer");

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
  const today = new Date().toISOString().split("T")[0];
  const lastNotified = item.lastNotified
    ? item.lastNotified.split("T")[0]
    : null;

  console.log(
    ` ${item.domain} → lastNotified: ${lastNotified}, today: ${today}`
  );

  if (lastNotified === today) {
    console.log(`Already notified today for domain: ${item.domain}`);
    return;
  }

  const notifyDays = (item.notifyDays || "")
    .split(",")
    .map((d) => parseInt(d.trim()))
    .filter((d) => !isNaN(d));

  for (const day of notifyDays) {
    if (item.daysLeft === day && item.email && item.email !== "N/A") {
      console.log(
        `Sending email: Domain "${item.domain}" expires in ${day} days. Notify ${item.email}`
      );

      try {
        await mailer.sendDomainExpiryMail(item.email, item.domain, day);

        // Update notify Days in DB
        await repository.updateLastNotified(item.userId, item.domain, today);

        console.log(`Notified ${item.email} for domain ${item.domain}`);
        break;
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
        try {
          // Fetch WHOIS data
          const response = await axios.get(
            "https://www.whoisxmlapi.com/whoisserver/WhoisService",
            {
              params: {
                apiKey: process.env.WHOIS_API_KEY,
                domainName: item.domain,
                outputFormat: "JSON",
              },
            }
          );

          const record = response.data.WhoisRecord;
          const newExpiry =
            record.expiresDate || record.registryData?.expiresDate;

          // Update expiry in DB if changed
          if (newExpiry && newExpiry !== item.expiryDate) {
            console.log(
              ` Updating expiry for ${item.domain}: ${item.expiryDate} → ${newExpiry}`
            );

            item.expiryDate = newExpiry;
            await repository.updateExpiryDate(
              item.userId,
              item.domain,
              newExpiry
            );
          }

          // Recalculate days left and notify
          const daysLeft = computeDaysLeft(item.expiryDate);
          if (daysLeft !== null) {
            item.daysLeft = daysLeft;
            await notifyUser(item);
          }
        } catch (err) {
          console.error(
            ` Failed to refresh WHOIS data for ${item.domain}:`,
            err.message
          );
        }
      }

      console.log(" Daily notifier completed successfully.");
    } catch (error) {
      console.error(" Error in daily notifier:", error.message);
    }
  });
}


module.exports = runDailyNotifier;
