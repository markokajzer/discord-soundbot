# Base will install runtime dependencies and configure generics
FROM node:12-slim as base
LABEL maintainer="Marko Kajzer <markokajzer91@gmail.com>"

RUN wget -O /tini https://github.com/krallin/tini/releases/download/v0.18.0/tini-$(dpkg --print-architecture)
RUN chmod +x /tini && mkdir /app && chown -R node:node /app
WORKDIR /app

USER node
COPY --chown=node:node package.json yarn.lock ./
RUN yarn install --frozen-lockfile --silent --production --ignore-optional && yarn cache clean --force

# Builder will compile tsc to js
FROM base AS build
RUN yarn install --frozen-lockfile --silent --ignore-optional
COPY . /app
RUN yarn build

# release has the bare minimum to run the application
FROM base as release
ENV NODE_ENV=production
COPY --chown=node:node --from=build ./app/dist ./dist
COPY --chown=node:node --from=build ./app/locale ./locale
COPY --chown=node:node --from=build ./app/storage ./storage
ENTRYPOINT ["/tini", "--"]
CMD ["node", "./dist/bin/soundbot.js"]
