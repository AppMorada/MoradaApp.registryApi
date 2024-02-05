FROM node:18.18-slim AS base

RUN mkdir -p /usr/node/app
WORKDIR /usr/node/app

RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install -y openssl default-jre musl-dev

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY tools ./tools
COPY src ./src
COPY package.json .
COPY pnpm-lock.yaml .

#---------- prod deps ------------
FROM base AS prod_deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

#--------- build stage -----------
FROM base AS builder

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY @types ./@types
COPY tsconfig.json .
COPY tsconfig.build.json .
COPY nest-cli.json .
COPY .swcrc .

RUN pnpm prisma generate
RUN pnpm run build

#------- release stage -----------
FROM base

COPY --from=prod_deps /usr/node/app/node_modules ./node_modules
COPY --from=builder /usr/node/app/dist ./dist
RUN pnpm prisma generate


VOLUME ["/usr/node/app/node_modules"]

CMD [ "pnpm", "start" ]
