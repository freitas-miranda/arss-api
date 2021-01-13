FROM node:10

WORKDIR /home/arss-api

COPY package*.json ./
COPY yarn.lock ./

COPY .npmrc ./
COPY .yarnrc ./

RUN yarn

COPY . .

RUN yarn build

EXPOSE 4400

CMD [ "yarn", "start" ]
