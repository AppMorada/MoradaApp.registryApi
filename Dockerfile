FROM node:18.18-slim

WORKDIR /home/node/app

RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install -y openssl default-jre musl-dev
RUN ln -s /usr/lib/x86_64-linux-musl/libc.so /lib/libc.musl-x86_64.so.1

RUN npm i pnpm firebase-tools -g

COPY ./package.json .

RUN pnpm install 

COPY . .

CMD [ "tail", "-f", "/dev/null" ]
