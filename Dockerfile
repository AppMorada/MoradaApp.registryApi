FROM node:18.18-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /home/node/app

RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install -y openssl default-jre musl-dev curl gpg
RUN ln -s /usr/lib/x86_64-linux-musl/libc.so /lib/libc.musl-x86_64.so.1

RUN npm i pnpm firebase-tools -g

COPY ./package.json .
COPY ./pnpm-lock.yaml .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .

CMD [ "tail", "-f", "/dev/null" ]
