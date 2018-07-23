FROM node:8

# Create app directory

WORKDIR /usr/src/client

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8082

CMD [ "npm", "start" ]
