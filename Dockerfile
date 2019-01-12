FROM node:carbon-alpine

LABEL maintainer="Marko Kajzer <markokajzer91@gmail.com>"

# Install ffmpeg and other deps
RUN apk add --no-cache --quiet build-base ffmpeg git make python

WORKDIR /app
COPY package*.json ./
RUN npm install --quiet

COPY . /app

# Cleanup
RUN apk del --quiet build-base

# Build
RUN npm run build

CMD ["npm", "run", "serve"]
