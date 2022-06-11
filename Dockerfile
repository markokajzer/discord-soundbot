# Base will install runtime dependencies and configure generics
FROM node:16-slim as base

LABEL maintainer="Marko Kajzer <markokajzer91@gmail.com>, Nico Stapelbroek <discord-soundbot@nstapelbroek.com>"

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

# Add `tiny` init for signal forwarding
RUN apt-get -qq update > /dev/null && \
    apt-get -qq -y install python3 wget > /dev/null && \
    rm -rf /var/lib/apt/lists

####################################################################################################

# Builder will install system dependencies
FROM base as builder

# Install build deps
RUN apt-get -qq update > /dev/null && \
    apt-get -qq -y install make g++ tar xz-utils > /dev/null && \
    rm -rf /var/lib/apt/lists

####################################################################################################

# Build will compile ts to js
FROM builder AS build

# Copy files
COPY --chown=node:node . /app

# Install compile dependencies
RUN yarn install --frozen-lockfile --silent && \
    yarn cache clean --force --silent

# Build project
RUN yarn build

####################################################################################################

# release has the bare minimum to run the application
FROM base as release

RUN wget -qO /tini https://github.com/krallin/tini/releases/download/v0.18.0/tini-$(dpkg --print-architecture) && \
    chmod +x /tini

RUN wget -qO /tmp/ffmpeg.tar.xz https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-$(dpkg --print-architecture)-static.tar.xz && \
    tar -x -C /usr/local/bin --strip-components 1 -f /tmp/ffmpeg.tar.xz --wildcards '*/ffmpeg' && \
    rm /tmp/ffmpeg.tar.xz

COPY --from=build --chown=node:node /app .

RUN npm install --global n
RUN n install 14

USER node
ENV NODE_ENV=production
ENTRYPOINT ["/tini", "--"]
CMD ["yarn", "serve"]
