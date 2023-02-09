FROM node

WORKDIR /simple-chat/server

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]