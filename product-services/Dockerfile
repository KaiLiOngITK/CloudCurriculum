# Start your image with a node base image
# FROM alpine:3.14
# RUN apk add --no-cache mysql-client
FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8081

CMD ["node", "index.js"]