# Amul Stock Notifier

A full-stack web application that monitors the availability of Amul High Protein products and sends Telegram notifications when selected products are back in stock.

## Features

* User signup and login
* Product search
* Multi-product tracking
* Pincode-based stock monitoring
* Telegram account integration
* Real-time stock notifications
* Disconnect Telegram
* Reset preferences
* Delete account
* Multi-user support

## Tech Stack

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Node.js
* Express.js
* Playwright
* Telegram Bot API

### Database

* JSON (Current)
* PostgreSQL (Migration in Progress)

## Project Structure

```text
frontend/
src/
data/
```

## Installation

1. Clone the repository.

```bash
git clone <repository-url>
```

2. Install dependencies.

```bash
npm install
```

3. Create a `.env` file.

```env
BOT_TOKEN=your_bot_token
HEADLESS=false
```

4. Start the server.

```bash
node src/server.js
```

## Upcoming Improvements

* PostgreSQL migration
* Password hashing using bcrypt
* JWT authentication
* Input validation
* Notification duration
* Production deployment

## License

This project is intended for educational and portfolio purposes.
