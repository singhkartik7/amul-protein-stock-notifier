FROM lwthiker/curl-impersonate:0.6-chrome

WORKDIR /app

# Install Node.js and npm
RUN apk add --no-cache nodejs npm

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]