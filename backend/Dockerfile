FROM node:18

ENV DB_HOST=demodb

WORKDIR /app

COPY package.json /app/

RUN npm install --production

COPY ./ /app/

CMD [ "node", "server.js" ]