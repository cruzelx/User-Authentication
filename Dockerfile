FROM node:18-alpine

ENV NODE_ENV=dev

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

# COPY . .

EXPOSE 8080

CMD ["npm","start"]