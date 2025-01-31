FROM node:20.11

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

CMD [ "node", "server" ]