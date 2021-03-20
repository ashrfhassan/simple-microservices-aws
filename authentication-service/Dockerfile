FROM node:12-alpine

COPY ./package.json /usr/service/package.json
COPY ./yarn.lock /usr/service/yarn.lock

WORKDIR /usr/service

RUN yarn

COPY . /usr/service

ENV STATEFULSET_HOST localhost
ENV NODE_ENV production
ENV PORT 8574
ENV DB_CONNECTION mysql
ENV DB_HOST localhost
ENV DB_PORT 3306
ENV DB_DATABASE auth_users
ENV DB_USERNAME root
ENV DB_PASSWORD secret
ENV USERS_WEBSERVER_URL http://localhost:80
ENV KONG_ADMIN_URL http://kong:8001

ENV DOCKERIZE_VERSION v0.6.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

EXPOSE 8574
CMD dockerize -wait tcp://${STATEFULSET_HOST}:5672 -timeout 60m yarn run build && yarn run start:prod