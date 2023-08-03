FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

ENV MONGO_URI="mongodb://netgaze360_mongo:27017/"

CMD [ "node", "app.js" ]