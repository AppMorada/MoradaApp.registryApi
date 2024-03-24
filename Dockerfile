FROM node:lts-bullseye-slim
LABEL maintainer="Nícolas Basilio"

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /home/node/app

RUN apt-get update -y && apt-get upgrade -y && \
	apt-get install -y \
		default-jre=2:1.11-72 \
		musl-dev=1.2.2-1 \
		procps=2:3.3.17-5 \
		--no-install-recommends && \
	ln -s /usr/lib/x86_64-linux-musl/libc.so /lib/libc.musl-x86_64.so.1 && \
	npm i pnpm@8.15.5 firebase-tools@13.5.2 -g && \
	apt-get clean && rm -rf /var/lib/apt/lists/*

COPY ./package.json .
COPY ./pnpm-lock.yaml .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .

CMD [ "tail", "-f", "/dev/null" ]
