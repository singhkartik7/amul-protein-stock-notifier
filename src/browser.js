const { chromium } = require("playwright");

async function launchBrowser(headless) {
  return await chromium.launch({
    headless,
  });
}

module.exports = {
  launchBrowser,
};