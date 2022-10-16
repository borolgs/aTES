# aTES
Awesome Task Exchange System (aTES)

## [Design](/docs//design/design.md)


## Usage

```sh
pnpm i

docker compose up # kafka, postgres

pnpm run start:dev # auth app
pnpm run start:dev tasks # tasks app
```
### .env
```ini
# DB
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=postgres
DB_SCHEMA=tasks

# MB
MOCK_MB=true

# Auth
AUTH_DB_SCHEMA=auth
AUTH_PORT=3000

AUTH_APP_CLIENT_ID=a422e2f3-6c44-4f8c-a490-64c35da23ca9
AUTH_APP_CLIENT_SECRET=35387a82-454c-4ef7-afca-64d0d9f5ab35
AUTH_APP_HOST=http://localhost:3000

# Tasks
TASKS_DB_SCHEMA=tasks
TASKS_PORT=4000

TASKS_AUTH_CLIENT_ID=a64885cb-b849-45f1-bd9a-b11959b78e9e
TASKS_AUTH_CLIENT_SECRET=36a314e4-a9c2-4e94-9be5-864395f3753e
TASKS_AUTH_HOST=http://localhost:3000
```

## API
- [Auth API](/docs/api/auth.http)
- [Tasks API](/docs/api/tasks.http)