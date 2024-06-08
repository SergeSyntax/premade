FROM node:20.14.0-alpine3.20

WORKDIR /usr/app

COPY lerna.json nx.json package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/mf-host/package.json services/mf-host/package.json

RUN pnpm install --prod
RUN pnpm store prune

COPY services/mf-host/ services/mf-host/

WORKDIR /usr/app/services/mf-host

CMD [ "pnpm", "start" ]

