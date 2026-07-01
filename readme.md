<div align="center">

# 🥛 Amul Stock Notifier

### Never Miss Your Favourite Amul Protein Products Again.

Real-time stock monitoring with instant Telegram notifications based on your selected pincode.

🌐 **Live Demo:** https://amul-stock-notifier.vercel.app/index.html

</div>

---

# 📖 About

Amul Stock Notifier is a full-stack web application that automatically monitors the availability of Amul Protein products and instantly notifies users on Telegram whenever their selected products come back in stock.

Instead of manually checking the Amul website multiple times a day, users simply select the products they want, enter their pincode, connect Telegram, and let the application monitor stock availability 24/7.

---

# ✨ Features

- 🥛 Track your favourite Amul Protein products
- 📍 Pincode-based stock monitoring
- 🔔 Instant Telegram stock notifications
- 🛒 Direct Buy Now link in every notification
- ⚡ Automated stock checking using Playwright
- 👤 User Authentication
- 🔐 JWT-secured API
- 🔑 Password hashing with bcrypt
- 🗄 PostgreSQL database hosted on Neon
- 🛡 SQL Injection protection using parameterized queries
- 🚦 API Rate Limiting
- ☁️ Cloud deployment using Vercel & Render
- 📱 Fully responsive interface

---

# 🚀 How It Works

1. Create an account.
2. Login to your dashboard.
3. Enter your delivery pincode.
4. Select the products you want to monitor.
5. Save your preferences.
6. Connect your Telegram account.
7. Activate notifications.
8. The stock checker continuously monitors Amul Store.
9. As soon as stock becomes available, you instantly receive a Telegram notification with a direct purchase link.

---

# 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js, Express.js |
| Database | Neon PostgreSQL |
| Authentication | JWT, bcrypt |
| Automation | Playwright |
| Notifications | Telegram Bot API |
| Deployment | Vercel, Render |

---

# 🔒 Security

This project follows several security best practices:

- JWT Authentication
- Password hashing using bcrypt
- SQL Injection protection with parameterized PostgreSQL queries
- API Rate Limiting using Express Rate Limit
- Protected API routes
- Environment variables for sensitive credentials

---

# 📂 Project Structure

```text
amul-stock-notifier
│
├── frontend/
│   ├── css/
│   ├── js/
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   └── dashboard.html
│
├── src/
│   ├── browser/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── telegram/
│   ├── utils/
│   ├── server.js
│   └── index.js
│
├── package.json
└── README.md
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/singhkartik7/amul-stock-notifier.git
```

Move into the project directory

```bash
cd amul-stock-notifier
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
DATABASE_URL=

JWT_SECRET=

BOT_TOKEN=

PORT=
```

Start the server

```bash
npm start
```

---

# 🌐 Live Demo

Visit the application here:

### https://amul-stock-notifier.vercel.app/index.html

---

# 🔮 Future Improvements

- Email notifications
- WhatsApp notifications
- Multiple pincode tracking
- Product price history
- Admin dashboard
- Product analytics
- Progressive Web App (PWA)

---

# 👨‍💻 Author

**Kartik Singh**

Computer Science Engineering Student

GitHub:
https://github.com/singhkartik7

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

It helps others discover the project and motivates further development.

---

# 📄 License

This project is licensed under the MIT License.