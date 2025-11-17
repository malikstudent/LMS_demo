<<<<<<< HEAD
=======
gh repo create "LMS-Demo" --public --source=. --remote=origin --push
git push -u origin main
# LMS Demo

This repository is a Learning Management System (LMS) demo using a Laravel 11 backend and a Vite + React frontend. It includes example data, API endpoints, and basic CI/CD workflows to build, test, and deploy the project.

Repository: https://github.com/malikstudent/LMS_demo

## Quick overview
- Backend: Laravel 11 (PHP) — located in `backend/`
- Frontend: Vite + React — located in `frontend/`
- CI: GitHub Actions (`.github/workflows/ci.yml`) — runs backend tests and frontend build on PRs and pushes to `main`
- Deploy: GitHub Actions (`.github/workflows/deploy.yml`) — rsync/SSH deploy on push to `main` (requires secrets)

## Table of contents
- [Requirements](#requirements)
- [Running locally (Docker)](#running-locally-docker)
# LMS Demo

This repository is a Learning Management System (LMS) demo using a Laravel 11 backend and a Vite + React frontend. It includes example data, API endpoints, and basic CI/CD workflows to build, test, and deploy the project.

Repository: https://github.com/malikstudent/LMS_demo

## Quick overview
- Backend: Laravel 11 (PHP) — located in `backend/`
- Frontend: Vite + React — located in `frontend/`
- CI: GitHub Actions (`.github/workflows/ci.yml`) — runs backend tests and frontend build on PRs and pushes to `main`
- Deploy: GitHub Actions (`.github/workflows/deploy.yml`) — rsync/SSH deploy on push to `main` (requires secrets)

## Table of contents
- [Requirements](#requirements)
- [Running locally (Docker)](#running-locally-docker)
- [Running locally (native)](#running-locally-native)
- [Database & seeding](#database--seeding)
- [Running tests](#running-tests)
- [Frontend development](#frontend-development)
- [CI / CD](#ci--cd)
- [Deployment](#deployment)
- [Branch protection & PR workflow](#branch-protection--pr-workflow)
- [Contributing](#contributing)
- [License](#license)

## Requirements
- Docker & Docker Compose (recommended for a quick local setup)
- PHP 8.1+ (if running backend natively)
- Composer (backend dependency manager)
- Node 18+ & npm (frontend dependencies)

## Running locally (Docker)
This repo includes a `docker-compose.yml` that spins up the backend, frontend, database, and nginx. The fastest way to run is with Docker.

1. Copy example environment files (if needed):

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env || true
```

2. Start services:

```bash
docker-compose up --build -d
```

3. Run migrations and seed (inside backend container):

```bash
# example: enter the backend container and run migrations
docker compose exec backend bash
cd backend
php artisan key:generate
php artisan migrate --seed
exit
```

The app will be available via the nginx service (see `docker-compose.yml` for port mapping).

## Running locally (native)
If you prefer to run services locally without Docker:

Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php -S localhost:8000 -t public
# or use `php artisan serve`
```

Frontend

```bash
cd frontend
npm ci
npm run dev   # starts Vite dev server
```

Open the frontend at the URL Vite prints (typically http://localhost:5173).

## Database & seeding
The `backend/database/seeders` directory contains seeders that populate demo users, classes, subjects, and sample content. Use `php artisan db:seed` after migrating to populate demo data.

## Running tests
Backend PHPUnit tests are included in `backend/tests/Feature`. To run them:

```bash
cd backend
./vendor/bin/phpunit --configuration phpunit.xml
```

Frontend has a build step in CI — you can also run lint/tests locally according to your frontend setup (not included by default).

## Frontend development
- Install dependencies: `cd frontend && npm ci`
- Start dev server: `npm run dev`
- Build production assets: `npm run build`

## CI / CD
- CI workflow: `.github/workflows/ci.yml` — runs on pull requests to `main` and pushes to `main`. It checks backend tests and builds the frontend.
- Deploy workflow: `.github/workflows/deploy.yml` — triggered on push to `main`. It uses an SSH key (stored as `SSH_PRIVATE_KEY`) to rsync the repository to a remote server and (optionally) run `php artisan migrate --force` when `RUN_MIGRATIONS` secret is set to `true`.

## Deployment
The provided `deploy.yml` uses rsync over SSH to mirror the repo to your server. Ensure the target directory is writable and the SSH key has access.

If you prefer other deployment methods (Docker Compose on the host, Docker Swarm, Kubernetes), adjust the workflow accordingly.


