FROM pantsel/konga:latest

#receiving ARG, used in building docker phase
ARG KONG_DB_HOST=localhost
ARG KONGA_DB=konga
ARG KONG_DB_USER=kong_db_user
ARG KONG_DB_PASSWORD=kong_db_password

#environment variables
ENV DB_ADAPTER postgres
ENV DB_HOST $KONG_DB_HOST
ENV DB_DATABASE $KONGA_DB
ENV DB_USER $KONG_DB_USER
ENV DB_PASSWORD $KONG_DB_PASSWORD
ENV TOKEN_SECRET 'km1GUr4RkcQD7DewhJPNXrCuZwcKmqjb'
ENV NODE_ENV 'development'

#expose konga port
EXPOSE 1337

ENTRYPOINT node ./bin/konga.js prepare --adapter postgres --uri postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST/konga && npm start