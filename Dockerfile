FROM node

# Create app dir
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install deps
COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/
RUN npm install

# env variables
ARG app
ENV NODE_PORT=3000
ENV app=$app

# Bundle app source
COPY . /usr/src/app/

# Start app
EXPOSE 3000
CMD ["node", "."]