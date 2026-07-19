FROM lwthiker/curl-impersonate:0.6-chrome

CMD ["sh", "-c", "ls -l /usr/local/bin && echo '====' && curl_chrome110 -I https://shop.amul.com/en/browse/protein || true"]