FROM node:latest

WORKDIR /home/node/app

RUN npm i pnpm -g

CMD [ "tail", "-f", "/dev/null" ]
