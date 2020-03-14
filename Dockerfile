# Base will install runtime dependencies and configure generics
FROM node:12.16

LABEL maintainer="Marko Kajzer <markokajzer91@gmail.com>"
WORKDIR /app

# Copy some files
COPY package.json yarn.lock ./
COPY . /app

# Install ffmpeg and other deps
RUN apt-get update
RUN apt-get install --yes build-essential git ffmpeg make python > /dev/null
RUN yarn install --silent

# Build
RUN yarn build

# Cleanup
RUN apt-get remove --yes build-essential > /dev/null

CMD ["yarn", "serve"]
