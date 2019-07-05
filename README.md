<h2 align="center">
  <img src="https://i.imgur.com/RGCZZjl.png" alt="LXD Hub Web Logo" width="500" />
</h2>

<p align="center">Display, search and copy <a href="https://linuxcontainers.org/lxd/" target="blank">LXD</a> images using a web interface.</p>

<p align="center">This Repository is the Webinterface for the LXDHub REST API.</p>
<p align="center">
  <a href="https://gitter.im/Roche/lxdhub?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge"><img src="https://badges.gitter.im/Roche/lxdhub.svg" alt="Gitter" /></a>
  <img src="https://circleci.com/gh/Roche/lxdhub.png?circle-token=dcfec05d35bc78c2dd21d39d68bb2cc71f6064ac&style=shield" alt="Circle CI Status">
  </a>
</p>
<p align="center">
  <a href="https://i.imgur.com/G6ANRSO.png">
    <img width="500" src="https://i.imgur.com/G6ANRSO.png" alt="LXDHub Image Overview Screenshot" />
  </a>
</p>

# NodeJS

[![Greenkeeper badge](https://badges.greenkeeper.io/Roche/lxdhub-web.svg)](https://greenkeeper.io/)

## Installation

To install the depencies of lxdhub-web, run the following command

```bash

yarn

```

## Run for Development

Run the following command for a dev server.
Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

```bash


yarn start
```

## Build for Production

Run the following command, to build the project.
The build artifacts will be stored in the `dist/` directory.

```bash
API_URL=<PROD_API_URL> LOGGING_URL=<PROD_API_URL>api/v1/log npm run build
```

# Docker

## Run in Development

Run and open the site on http://localhost:4200

```bash
docker build -t lxdhub-web:dev . && docker run -p 4200:80 lxdhub-web:dev
```

## Run in Production

0. Configure nginx (optional)

You can configure the nginx configuration, which is used to serve the
built `dist/` folder. Readme more about [nginx](http://nginx.org/en/docs/beginners_guide.html).

Edit the configuration by running in your shell `vi nginx-custom.conf`

1. Build the image

```bash
docker build -t lxdhub-web:prod --build-arg env=prod \
--build-arg API_URL=http://prod.com:3000 \
--build-arg LOGGING_URL=http://prod.com:3000api/v1/log .
```

2. Run the image

```bash
docker run -p 80:80  lxdhub-web:prod
```


3. Open LXDHub Web in your browser http://localhost

# Tests

Run the following command to execute the unit tests via [Karma](https://karma-runner.github.io).

```bash
npm run test
npm run test:coverage # For coverage report, generated in folder coverage
```

# More Links

- [@lxdhub](https://github.com/Roche/lxdhub)
- [@lxdhub/api](lib/api/README.md)
- [@lxdhub/db](lib/db/README.md)
- [@lxdhub/dbsync](lib/dbsync/README.md)
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [COPYRIGHT.md](COPYRIGHT.md)


# People

- [Livio Brunner](https://github.com/BrunnerLivio) - Author
- [Eric Keller](https://github.com/erickellerek1) - Idea
