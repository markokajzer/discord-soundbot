FROM node:carbon-alpine

MAINTAINER Marko Kajzer <markokajzer91@gmail.com>

# Install ffmpeg and other deps
RUN apk add --no-cache --quiet build-base ffmpeg git make python

WORKDIR /app
COPY . /app
COPY package*.json ./
RUN npm install --only=production --quiet

# Cleanup
RUN apk del --silent build-base

CMD ["npm", "start"]
