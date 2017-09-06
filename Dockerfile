FROM node

# Create app dir
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install deps
COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app/

# Start app
EXPOSE 3000
CMD ["node", "."]