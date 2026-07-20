const { execFile } = require("node:child_process");

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

class CurlHttpError extends Error {
    constructor(status, responseBody, url) {
        super(`Curl request to ${url} failed with HTTP ${status}`);
        this.name = "CurlHttpError";
        this.status = status;
        this.responseBody = responseBody;
    }
}

function executeCurl(args) {
    return new Promise((resolve, reject) => {

        
        

       execFile(
    "curl_chrome116",
            args,
            {
                encoding: "utf8",
                maxBuffer: CURL_MAX_BUFFER_BYTES
            },
            (error, stdout, stderr) => {
                if (error) {
                    const details = (stderr && stderr.trim()) || error.message;
                    reject(new Error(`Curl request failed: ${details}`));
                    return;
                }

                resolve(stdout);
            }
        );
    });
}

function parseCurlOutput(output) {
    let cursor = 0;
    let status = 0;
    let headers = {};

    while (output.startsWith("HTTP/", cursor)) {
        const separator = output.indexOf("\r\n\r\n", cursor);
        if (separator === -1) break;

        const headerBlock = output.slice(cursor, separator);
        const lines = headerBlock.split("\r\n");
        const statusMatch = lines[0] && lines[0].match(/^HTTP\/\S+\s+(\d{3})/);
        if (!statusMatch) break;

        status = Number(statusMatch[1]);
        headers = {};

        for (const line of lines.slice(1)) {
            const colonIndex = line.indexOf(":");
            if (colonIndex === -1) continue;

            const name = line.slice(0, colonIndex).trim().toLowerCase();
            const value = line.slice(colonIndex + 1).trim();
            (headers[name] ??= []).push(value);
        }

        cursor = separator + 4;
    }

    if (!status) {
        throw new Error("Curl response did not contain an HTTP status line");
    }

    return {
        status,
        headers,
        body: output.slice(cursor),
        setCookies: headers["set-cookie"] ?? []
    };
}

async function curlRequest({
    url,
    method = "GET",
    headers = {},
    body,
    jar
}) {
    const args = [
    "--silent",
    "--show-error",
    "--location",
    "--globoff",
    "--compressed",

   

    "--connect-timeout",
    "10",
    "--max-time",
    CURL_TIMEOUT_SECONDS.toString(),
    "--dump-header",
    "-",
    "--request",
    method
];

 const finalHeaders = {
    ...DEFAULT_HEADERS,
    ...headers
};

if (jar) {
    const cookie = await jar.getCookieString(url);

    if (cookie) {
        finalHeaders.cookie = cookie;
    }
}

for (const [name, value] of Object.entries(finalHeaders)) {
    args.push("--header", `${name}: ${value}`);
}

    if (body !== undefined) {
        args.push("--data-raw", JSON.stringify(body));
    }

    args.push(url);

   const response = parseCurlOutput(await executeCurl(args));

if (jar && response.setCookies.length) {
    for (const cookie of response.setCookies) {
        await jar.setCookie(cookie, url);
    }
}
    if (response.status >= 400) {
        throw new CurlHttpError(response.status, response.body, url);
    }

    return response;
}

module.exports = {
    curlRequest,
    CurlHttpError
};
