# Base will install runtime dependencies and configure generics
FROM node:12-slim as base
LABEL maintainer="Marko Kajzer <markokajzer91@gmail.com>"
ENV NODE=ENV=production

ADD https://github.com/krallin/tini/releases/download/v0.18.0/tini /tini
RUN chmod +x /tini && mkdir /app && chown -R node:node /app
WORKDIR /app

RUN apt-get update && apt-get install -yqq ffmpeg libopus0 && rm -rf /var/lib/apt/lists/*

USER node
COPY --chown=node:node package.json yarn.lock ./
COPY --chown=node:node config config
COPY --chown=node:node sounds sounds
RUN yarn install --frozen-lockfile --production --ignore-optional

# Builder will compile tsc to js
FROM base AS build
RUN yarn install --frozen-lockfile --silent --ignore-optional
COPY . /app
RUN yarn build

# Prod has the bare minimum to run the application
FROM base as prod
COPY --chown=node:node --from=build ./app/dist ./dist
RUN yarn cache clean --force
ENTRYPOINT ["/tini", "--"]
CMD ["node", "./dist/bin/soundbot.js"]
