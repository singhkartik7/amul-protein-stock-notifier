# Amul Stock Notifier

An automation project that monitors stock availability of Amul protein products and sends Telegram notifications when products come back in stock.

## Features

- Automated browser interaction using Playwright
- Automatic pincode selection
- Real-time inventory monitoring
- Telegram notifications
- Stock change tracking using local storage

## Tech Stack

- Node.js
- Playwright
- Telegram Bot API
- JavaScript

## How It Works

1. Opens Amul Protein Store
2. Selects delivery pincode
3. Reads inventory from Amul API responses
4. Compares with previous inventory
5. Sends Telegram alert when stock becomes available
6. Saves inventory state to prevent duplicate notifications