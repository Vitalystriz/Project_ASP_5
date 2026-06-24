FROM node:lts-alpine3.21

WORKDIR /app/src
COPY package*.json ./

RUN npm install express
RUN npm install cors

COPY . .

CMD ["node", "app.js"]

