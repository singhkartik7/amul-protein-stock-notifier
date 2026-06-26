# Amul Stock Notifier Backend

A Node.js backend service that monitors the inventory of Amul High Protein products and sends Telegram notifications when selected products come back in stock.

## Features

* Multi-user support
* User authentication
* User-specific pincode tracking
* User-specific product selection
* Telegram Bot integration
* Automatic stock monitoring
* Per-pincode stock history
* REST API for frontend integration
* Modular project structure

## Tech Stack

* Node.js
* Express.js
* Playwright
* Telegram Bot API
* Axios
* JSON File Storage

## Project Structure

```
src/
│
├── routes/
├── browser.js
├── telegram.js
├── telegramListener.js
├── notifier.js
├── stockStore.js
├── index.js
└── server.js

data/
├── preferences.json
├── products.json
└── stock.json
```

## Environment Variables

Create a `.env` file:

```env
BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN
HEADLESS=false
```

## Installation

Clone the repository

```bash
git clone <repository-url>
```

Install dependencies

```bash
npm install
```

Start the server

```bash
node src/server.js
```

## How It Works

1. Users save their preferred pincode and products.
2. Users connect their Telegram account using the dashboard.
3. The backend periodically checks product availability.
4. Stock history is maintained separately for each pincode.
5. When a selected product becomes available, the corresponding user receives a Telegram notification.

## API Endpoints

### Authentication

```
POST /auth/signup
POST /auth/login
```

### Preferences

```
GET  /preferences/:username
POST /preferences
```

### Telegram

```
POST /telegram/connect
```

### Products

```
GET /products
```

### Stock

```
GET /stock
```

### Health

```
GET /health
```

## Notes

* This repository contains only the backend service.
* The frontend dashboard is maintained separately.
* Do not commit your `.env` file or real Telegram credentials.
* Example data is provided for development purposes.

## Future Improvements

* PostgreSQL database
* Docker support
* Redis caching
* Background job queue
* Deployment to cloud infrastructure
* Admin dashboard
* Email notifications

## License

This project is intended for educational and portfolio purposes.
