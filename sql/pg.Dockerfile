FROM postgres:11-alpine as dumper

ENV POSTGRES_DB=mydb
ENV PG_USER=postgres
ENV POSTGRES_PASSWORD=password
ENV PGDATA=/data

COPY ./init.sql /docker-entrypoint-initdb.d/

RUN ["sed", "-i", "s/exec \"$@\"/echo \"skipping...\"/", "/usr/local/bin/docker-entrypoint.sh"]

RUN ["/usr/local/bin/docker-entrypoint.sh", "postgres"]

FROM postgres:11-alpine

COPY --from=dumper /data $PGDATA
