# DataLouna test task with Effect ecosystem

1. Run
```shell
docker compose up -d
```

2. Apply Migrations
```shell
docker compose exec api pnpm run db push
```

3. Seeding
```shell
docker compose exec api pnpm run db:seed:prod
```

4. API docs:
- Scalar - http://localhost:3000/docs/scalar
- Swagger - http://localhost:3000/docs/swagger
- OpenAPI.json - http://localhost:3000/docs/openapi.json
