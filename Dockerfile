FROM node
COPY . /usr/src/app
WORKDIR "/usr/src/app"
CMD ["npm", "install"]
CMD ["node", "."]