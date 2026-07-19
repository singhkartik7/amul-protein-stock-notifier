FROM lwthiker/curl-impersonate:0.6-chrome AS curlimp

FROM mcr.microsoft.com/playwright:v1.61.0-noble

WORKDIR /app

# Copy curl-impersonate
COPY --from=curlimp /usr/local/bin/ /usr/local/bin/
COPY --from=curlimp /usr/local/lib/ /usr/local/lib/

RUN ldconfig

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
