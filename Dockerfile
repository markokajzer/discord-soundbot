# base stage will install runtime dependencies and configure generics
FROM node:12.16-slim AS base

LABEL maintainer="Marko Kajzer <markokajzer91@gmail.com>"
WORKDIR /app

# Install ffmpeg and other deps
RUN apt-get update > /dev/null
RUN apt-get install --yes -qq build-essential ffmpeg make python > /dev/null
RUN rm -rf /var/lib/apt/lists

# Copy some files
COPY package.json yarn.lock ./

# Install runtime dependencies
RUN yarn install --production --frozen-lockfile --silent
RUN yarn cache clean --force


# build stage will compile ts to js
FROM base AS build

# Copy some files
COPY . /app

# Install compile dependencies
RUN yarn install --frozen-lockfile --silent
RUN yarn cache clean --force --silent

# Build project
RUN yarn build

# Cleanup
RUN apt-get remove --yes -qq build-essential make python > /dev/null


# release stage has the bare minimum to run the application
FROM base as release

USER node
ENV NODE_ENV=production

COPY --chown=node:node --from=build ./app/dist ./dist
COPY --chown=node:node --from=build ./app/config ./config
COPY --chown=node:node --from=build ./app/sounds ./sounds

# Start the bot
CMD ["yarn", "serve"]
