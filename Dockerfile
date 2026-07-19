FROM mcr.microsoft.com/playwright:v1.61.0-noble

WORKDIR /app

COPY package*.json ./

RUN npm install

# Optional: verify curl exists
RUN curl --version

COPY . .

ENV NODE_ENV=production

EXPOSE 10000

CMD ["node", "src/server.js"]