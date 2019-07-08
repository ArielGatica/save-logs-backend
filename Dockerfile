FROM node:10.16.0

RUN mkdir -p /usr/src/app
RUN mkdir -p /app/log

WORKDIR /usr/src/app

COPY api/ /usr/src/app
COPY package*.json ./

RUN npm install

CMD [ "node", "."]
