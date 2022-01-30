FROM node:alpine as development

WORKDIR /usr/src/auth

COPY package.json ./

COPY yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

FROM node:alpine as production

WORKDIR /usr/src/auth

COPY package*.json .

COPY yarn.lock .

RUN yarn

COPY . .

COPY --from=development /usr/src/auth/dist  ./dist

CMD [ "node", "dist/main" ]