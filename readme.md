<div align="center">

# 🥛 Amul Protein Stock Notifier

![Node.js](https://img.shields.io/badge/Node.js-20-green)
![Express.js](https://img.shields.io/badge/Express.js-Backend-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue)
![Telegram](https://img.shields.io/badge/Telegram-Bot_API-blue)
![Status](https://img.shields.io/badge/Status-Active-success)

Never miss your favourite Amul Protein products again.

Receive instant Telegram notifications when the products you care about come back in stock.

**🌐 Live Demo:** https://amul-stock-notifier.vercel.app

</div>

---

## About

Amul Protein products often go out of stock, and checking the website multiple times a day quickly becomes frustrating.

I originally built this project to solve that problem for myself.

Instead of manually refreshing the Amul website, users can simply select the products they want, choose their delivery pincode, connect their Telegram account, and let the application monitor stock automatically.

Whenever a selected product becomes available, the user instantly receives a Telegram notification with a direct purchase link.

The application groups users based on their delivery store, reducing unnecessary API requests while allowing multiple users to monitor different products from the same location.

---

## Features

- User authentication
- Secure login and signup
- Pincode based stock monitoring
- Product specific notifications
- Telegram integration
- Direct purchase links in every notification
- Automatic background stock checking
- PostgreSQL database
- JWT authentication
- Password hashing using bcrypt
- SQL Injection protection using parameterized queries
- API rate limiting
- Responsive user interface
- Cloud deployment using Vercel and Render

---

## How It Works

1. Create an account.
2. Log in to the dashboard.
3. Enter your delivery pincode.
4. Select the products you want to monitor.
5. Save your preferences.
6. Connect your Telegram account.
7. Enable notifications.
8. The stock checker continuously monitors product availability.
9. When stock becomes available, a Telegram notification is sent instantly with a direct purchase link.

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | PostgreSQL (Neon) |
| Authentication | JWT, bcrypt |
| Notifications | Telegram Bot API |
| Deployment | Vercel, Render |

---

## Project Architecture

```text
                    ┌───────────────────────┐
                    │      Frontend         │
                    │ HTML • CSS • JS       │
                    └──────────┬────────────┘
                               │
                               │ REST API
                               ▼
                    ┌───────────────────────┐
                    │ Express.js Backend    │
                    └──────────┬────────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
         ▼                     ▼                     ▼
 PostgreSQL              Telegram Bot          Amul Store APIs
 (Users & Preferences)    Notifications         Stock Checking
```

---

## Project Structure

```text
Amul_Stock_Notifier
│
├── frontend
│   ├── css
│   ├── js
│   ├── dashboard.html
│   ├── login.html
│   ├── signup.html
│   └── index.html
│
├── src
│   ├── database
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── telegram
│   ├── utils
│   ├── server.js
│   └── index.js
│
├── package.json
└── README.md
```

---

## Installation

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

Create a `.env` file in the project root.

```env
DATABASE_URL=

JWT_SECRET=

BOT_TOKEN=

PORT=
```

Start the backend server

```bash
npm start
```

---

## Security

The application follows several security best practices to protect user accounts and sensitive information.

- JWT based authentication
- Password hashing using bcrypt
- Parameterized PostgreSQL queries to prevent SQL Injection
- Protected API routes
- Environment variables for sensitive credentials
- API rate limiting
- Secure password storage

---

## Challenges Solved

Building this project involved solving several interesting engineering problems beyond simply checking product stock.

### Pincode to Store Mapping

The Amul APIs operate using internal store IDs rather than user pincodes. A custom lookup system was built to convert delivery pincodes into their corresponding store IDs before monitoring stock.

---

### Reducing API Requests

Instead of checking products separately for every user, users are grouped by store.

This allows a single API request to serve multiple users while still sending personalized notifications based on each user's selected products.

---

### Notification Management

The application keeps track of previously detected stock quantities to ensure users only receive notifications when stock actually changes, preventing duplicate alerts.

---

### Database Migration

The project originally stored data in JSON files.

As the application grew, it was migrated completely to PostgreSQL, making it more reliable, scalable and easier to maintain.

---

## Future Improvements

Some features planned for future versions include:

- Email notifications
- WhatsApp notifications
- Multiple pincode tracking
- Product availability history
- Product price tracking
- Admin dashboard
- Analytics dashboard
- Progressive Web App (PWA)

---

## Acknowledgements

This project uses publicly accessible data from the Amul online store to monitor product availability.

It is an independent project created for educational and personal use and is not affiliated with or endorsed by Amul.

---

## Author

**Kartik Singh**

Final Year B.Tech Computer Science Engineering Student

- GitHub: https://github.com/singhkartik7
- LinkedIn: https://www.linkedin.com/in/singhkartik7

---

## Contributing

Contributions, suggestions and bug reports are always welcome.

If you find an issue or have an idea for improving the project, feel free to open an Issue or submit a Pull Request.

---

## License

This project is licensed under the MIT License.

---

<div align="center">

### ⭐ If you found this project useful, consider giving it a star!

It helps others discover the project and motivates future development.

</div>