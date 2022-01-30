<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="220" alt="Nest Logo" /></a>
</p>

# How to run?

## Envs
There is the same env template for both ways to run it, the only thing that changes is the name of the files.

### Env template
```bash
DB_PORT=
DB_HOST=
RMQ_USER=
RMQ_PASSWORD=
RMQ_PORT=
RMQ_HOST=
```

To run in docker, create a `.env` file name.
To run locally, create a `.local.env` file name

## Without Docker

```bash
yarn
yarn start:debug
```

```bash
npm install
npm run start:debug
```

## With Docker

```bash
yarn #or npm install
docker-compose up mongodb
docker-compose up dev
```