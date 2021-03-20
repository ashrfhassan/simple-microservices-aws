FROM node:12-alpine

COPY ./package.json /usr/service/package.json
COPY ./yarn.lock /usr/service/yarn.lock

WORKDIR /usr/service

RUN yarn

COPY . /usr/service

ENV STATEFULSET_HOST localhost
ENV NODE_ENV production
ENV SOCKET_IO_PORT 3000
ENV RABBITMQ_DEFAULT_USER root
ENV RABBITMQ_DEFAULT_PASS secret
ENV RABBITMQ_URI amqp://root:root@localhost:5672

ENV DOCKERIZE_VERSION v0.6.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

EXPOSE 3000
CMD dockerize -wait tcp://${STATEFULSET_HOST}:5672 -timeout 60m yarn start
