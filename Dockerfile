FROM lwthiker/curl-impersonate:0.6-chrome AS curlimp

FROM mcr.microsoft.com/playwright:v1.61.0-noble

WORKDIR /app

# Copy curl-impersonate binaries and libraries
COPY --from=curlimp /usr/local/bin/ /usr/local/bin/
COPY --from=curlimp /usr/local/lib/ /usr/local/lib/

RUN ldconfig

COPY package*.json ./

RUN npm install

# Verify what was copied
RUN echo "===== curl =====" && curl --version

RUN echo "===== curl-impersonate binaries =====" && \
    ls -la /usr/local/bin | grep curl

RUN echo "===== Testing curl-impersonate =====" && \
    (curl_chrome116 -I https://shop.amul.com/en/browse/protein || true)

COPY . .

ENV NODE_ENV=production

EXPOSE 10000

CMD ["node", "src/server.js"]