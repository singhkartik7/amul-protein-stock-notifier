const { Impit } = require("impit");

const CURL_TIMEOUT_SECONDS = 30;
const CURL_MAX_BUFFER_BYTES = 25 * 1024 * 1024;
const DEFAULT_HEADERS = {
    accept: "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9,hi;q=0.8,gu;q=0.7",
    base_url: "https://shop.amul.com/en/browse/protein",
    "cache-control": "no-cache",
    frontend: "1",
    pragma: "no-cache",
    priority: "u=1, i",
    referer: "https://shop.amul.com/en/browse/protein",
    "sec-ch-ua":
        '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Linux"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "sec-gpc": "1",
    "user-agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
};
const impit = new Impit({
    browser: "chrome"
});
class CurlHttpError extends Error {
    constructor(status, responseBody, url) {
        super(`Curl request to ${url} failed with HTTP ${status}`);
        this.name = "CurlHttpError";
        this.status = status;
        this.responseBody = responseBody;
    }
}



async function curlRequest({
    url,
    method = "GET",
    headers = {},
    body
}) {
    const finalHeaders = {
        ...DEFAULT_HEADERS,
        ...headers
    };

    const response = await impit.fetch(url, {
        method,
        headers: finalHeaders,
        body:
            body !== undefined
                ? JSON.stringify(body)
                : undefined
    });

    const responseBody = await response.text();

    const responseHeaders = {};

    for (const [key, value] of response.headers.entries()) {
        responseHeaders[key.toLowerCase()] = [value];
    }

    if (response.status >= 400) {
        throw new CurlHttpError(
            response.status,
            responseBody,
            url
        );
    }

    return {
        status: response.status,
        headers: responseHeaders,
        body: responseBody,
        setCookies: []
    };
}

module.exports = {
    curlRequest,
    CurlHttpError
};
