# Start your image with a node base image
# FROM alpine:3.14
# RUN apk add --no-cache mysql-client
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "run", "start"]