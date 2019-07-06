FROM node:carbon-alpine

LABEL maintainer="Marko Kajzer <markokajzer91@gmail.com>"

# Install ffmpeg and other deps
RUN apk add --no-cache --quiet build-base ffmpeg git make python

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --silent

COPY . /app

# Cleanup
RUN apk del --quiet build-base

# Build
RUN yarn build

CMD ["yarn", "serve"]
