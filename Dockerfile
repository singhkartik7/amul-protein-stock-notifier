FROM lwthiker/curl-impersonate:0.6-chrome AS curlimp

RUN find / -name "curl-impersonate-chrome" 2>/dev/null || true
RUN file /usr/local/bin/curl-impersonate-chrome
RUN ldd /usr/local/bin/curl-impersonate-chrome || true

FROM mcr.microsoft.com/playwright:v1.61.0-noble

WORKDIR /app

COPY --from=curlimp /usr/local/bin/ /usr/local/bin/
COPY --from=curlimp /usr/local/lib/ /usr/local/lib/

RUN file /usr/local/bin/curl-impersonate-chrome
RUN ldd /usr/local/bin/curl-impersonate-chrome || true

RUN apt-get update && \
    apt-get install -y busybox && \
    ln -sf /bin/busybox /usr/bin/ash && \
    ln -sf /bin/busybox /usr/local/bin/ash && \
    rm -rf /var/lib/apt/lists/*

RUN ldconfig

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]