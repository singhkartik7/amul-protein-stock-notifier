# 🥛 Amul Protein Stock Notifier

A full-stack web application that monitors the availability of Amul High Protein products on the Amul online store and sends real-time Telegram notifications when selected products are restocked.

Designed to solve the problem of frequently out-of-stock Amul protein products by automatically checking inventory every few minutes and notifying users instantly.

---

# ✨ Features

### 👤 User Management

- User Signup
- User Login
- Delete Account
- Persistent user preferences

### 📦 Product Tracking

- Search products
- Track multiple products
- Pincode-based availability
- Save product preferences
- Reset tracking preferences

### 🔔 Notification System

- Telegram Bot Integration
- Connect / Disconnect Telegram
- Instant stock notifications
- Notification duration control
    - 1 Day
    - 3 Days
    - 7 Days
    - 15 Days
    - 30 Days
- Start Notifications
- Stop Notifications
- Live notification status
- Notification expiry countdown

### ⚡ Stock Monitoring

- Automatic stock checking
- Multi-user support
- Pincode-wise optimization
- Stock change detection
- Duplicate notification prevention

---

# 🛠 Tech Stack

## Frontend

- HTML5
- CSS3
- JavaScript

## Backend

- Node.js
- Express.js
- Playwright
- Telegram Bot API
- JWT Authentication
- bcrypt
- Helmet
- Express Rate Limit

## Database

- PostgreSQL

---

# 🗄 Database

The application uses PostgreSQL with the following tables:

- users
- preferences
- tracked_products
- stock

---

# 🚀 Installation

## Clone Repository

```bash
git clone <repository-url>
```

## Install Dependencies

```bash
npm install
```

## Create Environment Variables

Create a `.env` file.

```env
BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN

DATABASE_URL=YOUR_POSTGRES_DATABASE_URL

HEADLESS=false
```

## Start the Server

```bash
node src/server.js
```

---

# 📁 Project Structure

```
frontend/
│
├── css/
├── js/
└── dashboard.html

src/
│
├── models/
├── routes/
├── database/
├── telegramListener.js
├── index.js
└── server.js

data/
└── products.json
```

---

# ⚙️ How It Works

1. User creates an account.
2. Connects Telegram.
3. Saves pincode and products.
4. Activates notifications for a selected duration.
5. Playwright checks Amul inventory periodically.
6. PostgreSQL stores stock history.
7. Telegram notification is sent whenever stock changes.

---

# 📌 Current Features

- ✅ PostgreSQL backend
- ✅ Multi-user architecture
- ✅ Product tracking
- ✅ Telegram integration
- ✅ Notification management
- ✅ Stock history
- ✅ Responsive dashboard
- ✅ JWT Authentication
- ✅ Password Hashing (bcrypt)
- ✅ Protected API Routes
- ✅ Rate Limiting
- ✅ Security Headers (Helmet)

---

# 🚧 Upcoming Improvements

- Change password
- Docker support
- Production deployment
- Admin dashboard
- Email notifications
- Analytics dashboard

---

# 📄 License

This project is developed for educational, portfolio, and personal learning purposes.