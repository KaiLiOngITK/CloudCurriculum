# Start your image with a node base image
FROM alpine:3.14
RUN apk add --no-cache mysql-client
# FROM node:18-alpine

# WORKDIR /app
# COPY . .
# RUN yarn install --production
# CMD ["node", "src/index.js"]
# EXPOSE 3000
