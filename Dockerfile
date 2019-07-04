FROM node:10.16.0

RUN mkdir -p /usr/src/application
WORKDIR /usr/src/application

RUN mkdir -p /application/log

COPY app/ /usr/src/application
COPY package*.json ./

RUN npm install

EXPOSE 8080

CMD [ "node", "."]


