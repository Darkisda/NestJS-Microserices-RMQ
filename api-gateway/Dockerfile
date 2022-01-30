FROM node:alpine as development

WORKDIR /usr/src/apigateway

COPY package.json ./

COPY yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

FROM node:alpine as production

WORKDIR /usr/src/apigateway

COPY package*.json .

COPY yarn.lock .

RUN yarn

COPY . .

COPY --from=development /usr/src/apigateway/dist  ./dist

CMD [ "node", "dist/main" ]