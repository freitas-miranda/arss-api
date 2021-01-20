FROM node:12

WORKDIR /deploy

COPY . .

RUN yarn
RUN yarn build

CMD [ "yarn", "start" ]
