FROM google/cloud-sdk:475.0.0-emulators
LABEL maintainer="Nícolas Basilio"

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /home/node/app

RUN printf "deb http://deb.debian.org/debian testing main\ndeb http://deb.debian.org/debian unstable main" > /etc/apt/sources.list && \
	apt-get update -y && apt-get upgrade -y && \
	apt-get install -y \
		nodejs \
		npm \
		procps \
		--no-install-recommends && \
	npm i pnpm firebase-tools@13.5.2 -g && \
	apt-get clean && rm -rf /var/lib/apt/lists/* 

COPY ./package.json .
COPY ./pnpm-lock.yaml .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .

CMD [ "tail", "-f", "/dev/null" ]
