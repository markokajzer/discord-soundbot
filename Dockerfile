# Base will install runtime dependencies and configure generics
FROM node:12-alpine AS base

LABEL maintainer="Marko Kajzer <markokajzer91@gmail.com>"
WORKDIR /app
RUN apk add --no-cache --quiet ffmpeg opus && mkdir sounds
COPY package.json yarn.lock ./
COPY config config
RUN yarn install --frozen-lockfile --production --ignore-optional

# Builder will compile tsc to js
FROM base AS build

RUN apk add --no-cache --quiet build-base git
RUN yarn install --frozen-lockfile --silent --ignore-optional
COPY . /app
RUN yarn build

# Prod has the bare minimum to run the precompiled application
FROM base as prod

COPY --from=build ./app/dist ./dist
ENTRYPOINT ["node"]
CMD ["./dist/bin/soundbot.js"]
