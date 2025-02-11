# React NextJS + Fastify example project

Features:
- NextJS frontend
- Fastify backend API
  - GraphQL endpoint
- Role-based access control

## Run as Docker containers

```sh
docker compose up
```

Then open a webbrowser and browse to http://localhost:3000.
Default username is `admin@localhost` with password `admin`.

### Traefik proxy

If you have a [Traefik](https://traefik.io/) proxy set up for docker, then instead you can run:

```sh
docker compose -f compose.traefik.yaml up
```

Make sure to use a host name that resolves to your traefik instance,
then browse to the configured host name (default is https://react-nextjs-fastify-example.docker.localhost).
