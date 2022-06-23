FROM node:16-slim

# Ignore package config warnings and update package list
ARG DEBCONF_NOWARNINGS=yes
RUN apt-get -qq update > /dev/null

# Install system dependencies
RUN apt-get -qq install ca-certificates python3 ffmpeg > /dev/null

# Install system build dependencies
RUN apt-get -qq install build-essential libtool > /dev/null

# Copy source and switch to node user
COPY --chown=node:node ./ /app/
WORKDIR /app
USER node

# Build app
RUN yarn install --frozen-lockfile --silent
RUN yarn build

# Clean up app dependencies
RUN npm config set update-notifier false
RUN npm prune --omit=dev
RUN yarn cache clean --force --silent

# Switch to root and clean up system dependencies
USER root
RUN apt-get -qq purge build-essential libtool > /dev/null
RUN rm -rf /var/lib/apt/lists/*

# Run
USER node
ENV NODE_ENV=production
ENTRYPOINT npm start
