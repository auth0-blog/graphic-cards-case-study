FROM node:alpine

# Create app dir
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install deps
COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/
RUN npm install
RUN apk add --no-cache bash
RUN apk add --no-cache curl

# env variables
ARG app
ENV NODE_PORT=3000
ENV app=$app

# Bundle app source
COPY . /usr/src/app/

# Start app
EXPOSE 3000
CMD ["node", "."]
