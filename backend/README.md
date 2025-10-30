# BookItNow — Backend (Production-ready guide)

This directory contains the backend for BookItNow (Node.js + TypeScript + Express + Prisma). The repository now includes production-ready Docker assets so you can build and run the full stack (Postgres + backend) without changing your host Node installation.

Important notes
- This repo expects Node 18+ for local development. For production we recommend running the app in the provided container built from `Dockerfile.prod`.
- Prisma is used as the ORM and requires proper migrations. The production entrypoint runs `npx prisma migrate deploy`.

Files added for production
- `Dockerfile.prod` — multi-stage image that builds TypeScript, generates Prisma client and produces a slim runtime image.
- `entrypoint-prod.sh` — runs `prisma migrate deploy` before launching the app.
- `docker-compose.prod.yml` — compose file to start Postgres + backend in production mode (with persistent volume).
- `.dockerignore` — keeps the Docker context small.

Quick production deploy (on a machine with Docker)
1. Copy the example env and set values (DATABASE_URL must point to the Postgres instance and JWT_SECRET must be set):

```bash
cd backend
cp .env.example .env
# edit .env and set DATABASE_URL (eg postgresql://bookit:bookitpass@db:5432/bookitnow_prod)
```

2. Build and run (detached):

```bash
# from repo root
docker compose -f backend/docker-compose.prod.yml up --build -d
```

3. Check logs & health:

```bash
docker compose -f backend/docker-compose.prod.yml ps
docker compose -f backend/docker-compose.prod.yml logs -f backend
curl http://localhost:4000/api/health
```

Notes on upgrades and maintenance
- The production image runs `npx prisma migrate deploy` at container start — ensure your migration files are present in `prisma/migrations` (generated via `npx prisma migrate dev` in dev).
- For zero-downtime deployments consider using rolling updates (Kubernetes, ECS, or a reverse proxy with healthchecks).

If you'd like I can also:
- Add a minimal `Dockerfile` for a database-runner (e.g., Postgres with init scripts),
- Add GitHub Actions workflow to build, test, and push the production image to a registry,
- Add a `deploy.sh` script that performs build, tag, push, and remote deploy steps.
