FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

STOPSIGNAL SIGTERM

EXPOSE 5000

#ENV MONGO_URI="mongodb://ng360_mongo:27017/ng360"

#CMD [ "node", "app.js" ]

CMD [ "npm", "run", "prod" ]