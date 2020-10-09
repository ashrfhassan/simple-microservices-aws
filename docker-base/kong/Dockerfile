FROM kong:2.0.4-ubuntu

#receiving ARG, used in building docker phase
ARG KONG_DB_HOST=localhost
ARG KONG_DB=kong
ARG KONG_DB_USER=kong_db_user
ARG KONG_DB_PASSWORD=kong_db_password

#environment variables
ENV KONG_ADMIN_ACCESS_LOG '/dev/stdout'
ENV KONG_ADMIN_ERROR_LOG '/dev/stderr'
ENV KONG_ADMIN_LISTEN '0.0.0.0:8001'
ENV KONG_CASSANDRA_CONTACT_POINTS $KONG_DB_HOST
ENV KONG_DATABASE 'postgres'
ENV KONG_PG_DATABASE $KONG_DB
ENV KONG_PG_HOST $KONG_DB_HOST
ENV KONG_PG_USER $KONG_DB_USER
ENV KONG_PG_PASSWORD $KONG_DB_PASSWORD
ENV KONG_PROXY_ACCESS_LOG '/dev/stdout'
ENV KONG_PROXY_ERROR_LOG '/dev/stderr'
ENV KONG_DECLARATIVE_CONFIG '/config/kong.yml'

#expose kong gateway port and admin port
EXPOSE 8000 8001

#run kong migration prepare of db
CMD kong migrations bootstrap && kong migrations up && kong migrations finish && kong start