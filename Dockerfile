FROM node:18 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=web-app --prod /prod/web-app
RUN mv ./apps/web-app/.next /prod/web-app/
RUN pnpm deploy --filter=api --prod /prod/api
ARG DBPATH=/prod/data.sqlite3
RUN pnpm run --filter db migrate
RUN pnpm run --filter db seed

FROM base AS web-app
COPY --from=build /prod/web-app /prod/web-app
WORKDIR /prod/web-app
EXPOSE 3000
CMD [ "pnpm", "start" ]

FROM base AS api
ENV FASTIFY_PORT=3001
ENV DBPATH=/db/data.sqlite3
COPY --from=build /prod/api /prod/api
COPY --from=build /prod/data.sqlite3 /db/data.sqlite3
WORKDIR /prod/api
EXPOSE 3001
CMD [ "pnpm", "start" ]
