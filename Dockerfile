FROM google/cloud-sdk:alpine
LABEL maintainer="Nícolas Basilio"

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /home/node/app

RUN apk add --no-cache \
		npm=10.2.5-r0 nodejs=20.12.1-r0 \
		openjdk8-jre=8.402.06-r0 && \
	npm i pnpm@8.15.5 firebase-tools@13.5.2 -g && \
	rm -rf /var/lib/apt/lists/* && \
	gcloud components install pubsub-emulator --quiet && \
	gcloud components update --quiet

COPY ./package.json .
COPY ./pnpm-lock.yaml .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .

CMD [ "tail", "-f", "/dev/null" ]
