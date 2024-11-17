# Home Library Service

This project is a system for managing a home library, using NestJS for the server-side logic and Prisma for database interaction.


## Requirements

- Docker
- Node.js version 22
- PostgreSQL

## Running the Project

The project uses Docker for local development. To run the project using Docker, follow these steps.

### 1. Install Docker

If you don't have Docker installed, follow the [official Docker documentation](https://docs.docker.com/get-docker/) to install it.

### 2. Set Up Environment Variables

Create a .env file in the root of the project and add the following variables:

```bash
PORT=4000

CRYPT_SALT=10
JWT_SECRET_KEY=secret123123
JWT_SECRET_REFRESH_KEY=secret123123
TOKEN_EXPIRE_TIME=1h
TOKEN_REFRESH_EXPIRE_TIME=24h

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=music_db
POSTGRES_PORT=5432
POSTGRES_HOST=postgres

DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"
```

### 3. Running with Docker
**1. Clone the repository:**

```bash
git clone git@github.com:anturchin/nodejs2024Q3-service.git
cd nodejs2024Q3-service
```
**2. Build and start the containers:**

```bash
docker-compose up --build
```

Docker Compose will create and start two services:

- `postgres:` the PostgreSQL database.
- `app:` the main application server, which will run on port 4000.

### 4. Stopping Docker Containers

To stop the running containers, use the following command:

```bash
docker-compose down
```

### Dockerfile Structure

```bash
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN npx prisma generate

EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate dev --name init && npm run start:dev"]
```

### Scripts

#### Common Running Scripts

- `npm run start:` Starts the server in development mode.
- `npm run start:dev:` Starts the server with auto-reload on file changes.
- `npm run build:` Builds the project into the dist folder.
- `npm run format:` Formats the code using Prettier.
- `npm run lint:` Lints the code using ESLint.
- `npm run test:` Runs tests with Jest.

### Notes

- Prisma ORM is used for database interaction. The database schema is generated using the command npx prisma generate.
- Database migrations can be applied with the command npx prisma migrate dev.
