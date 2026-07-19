FROM lwthiker/curl-impersonate:0.6-chrome AS curlimp

FROM mcr.microsoft.com/playwright:v1.61.0-noble

WORKDIR /app

COPY --from=curlimp /usr/local/bin/ /usr/local/bin/
COPY --from=curlimp /usr/local/lib/ /usr/local/lib/

RUN apt-get update && \
    apt-get install -y busybox && \
    ln -sf /bin/busybox /usr/bin/ash && \
    ln -sf /bin/busybox /usr/local/bin/ash && \
    rm -rf /var/lib/apt/lists/*

RUN which ash && ash --help | head -1

RUN ldconfig
RUN head -5 /usr/local/bin/curl_chrome116

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]