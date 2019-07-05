FROM node:12

WORKDIR /var/lib/lxdhub-web

COPY package.json yarn.lock ./
RUN yarn --pure-lockfile --ignore-scripts
COPY . .
RUN yarn run build

ENTRYPOINT [ "yarn", "run" ]
CMD [ "start" ]
