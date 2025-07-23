#  Domain-Tracker Application

**Hosted Version:** 
 **LinkedIn:** [Vanshi](https://www.linkedin.com/in/vanshi-puri)

Created by Vanshi in July 2025

---

![App Screenshot](<src/assets/Screenshot_22-7-2025_125439_localhost.png>)

---

## Introduction

A full-stack web app that allows users to **track domain expiry dates**, get **WHOIS info**, and receive **email alerts** before domains expire. Built with **Vue.js**, **Node.js**, **Express**, **SQLite**, and **Capacitor** for Android app deployment.

---

##  What is this Application?

Domain Tracker is a full-stack web application that helps users:

- Look up WHOIS data for domains
- Track domain expiry dates
- Set custom email reminders
- Get notified before domain expiration (Eg: 1–30 days prior)
- Manage personal search history and tracked domains
- Access the app on mobile via Android (using Capacitor)
- Securely log in and track domains specific to their account

---

## Features...

### Authentication
- User login & registration with JWT tokens
- Token stored and validated securely

### Domain Tracking
- Search any domain using WHOISXML API
- Cache WHOIS data to reduce API usage
- Store and display expiry date info

### Notifications
- Email reminders sent **notifydays** before expiry
- CRON job runs once daily and avoids duplicate sends using database tracking
- Supports multiple email addresses separated by commas
- Mailpit integration for development/testing

### Domain Management
- Track and untrack domains
- Customize which days to receive notifications
- Per-user domain tracking (with `userId`)
- Search history is user-specific

###  Mobile App 
- Deployed to Android using Capacitor
- Play Store-ready with minimal changes

---

## Screen Recording



---

##  Tech Stack

**Frontend:**  
Vue.js 3, Vue Router, Tailwind CSS, Axios, SweetAlert2

**Backend:**  
Node.js, Express.js, SQLite, JWT, dotenv, node-cache, nodemailer

**Tools & Services:**  
WHOISXML API, Mailpit (for emails), Capacitor (for mobile build)

---

##  How to Run the App Locally

### 1. Clone the Repository
```bash
git clone https://github.com/vanshipuri/domain-search-vue.git
cd domain-search-vue
