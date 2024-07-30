FROM node:20.16.0-alpine3.20
LABEL maintainer="Nícolas Basilio"

ENV PNPM_HOME="/pnpm"
ENV PATH="/home/node/app/google-cloud-sdk/bin:$PNPM_HOME:$PATH"

WORKDIR /home/node/app

RUN apk add \
		bash=5.2.26-r0 \
		python3=3.12.3-r1 \
		py3-pip=24.0-r2 \
		curl=8.9.0-r0 \
		--no-cache && \
	curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-linux-x86_64.tar.gz && \
	tar -xf ./google-cloud-cli-linux-x86_64.tar.gz && \
	./google-cloud-sdk/install.sh \
                --usage-reporting false \
                --command-completion false \
                --path-update false \
                --rc-path ~/.bashrc && \
	yes | ./google-cloud-sdk/bin/gcloud components install pubsub-emulator && \
    yes | ./google-cloud-sdk/bin/gcloud components install beta && \
    corepack enable pnpm && \
	corepack use pnpm@latest-9 && \
	npm install firebase-tools@13.5.2 -g && \
	rm -rf /var/cache/apk/* 

COPY ./package.json .
COPY ./pnpm-lock.yaml .

COPY . .

CMD [ "tail", "-f", "/dev/null" ]
