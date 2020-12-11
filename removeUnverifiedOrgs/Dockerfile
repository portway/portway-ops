FROM node:14.15.0-alpine

WORKDIR /script

# Only copy package.json first to take advantage of docker caching
COPY package*.json ./

RUN npm install

# Use .dockerignore for things to not copy
COPY . .

CMD ["node", "index.js"]