FROM node:12.18-alpine

WORKDIR /script

# Only copy package.json first to take advantage of docker caching
COPY package*.json ./

RUN npm install

# Use .dockerignore for things to not copy
COPY . .

CMD ["node", "index.js"]