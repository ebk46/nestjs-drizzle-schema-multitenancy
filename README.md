## Description

This is a starter template for a NestJS + Drizzle + Postgres application that achieves schema-based multitenancy. It includes support for:

- Shared and Tenant-specific schemas
- Migration generation
- Migration execution
- Durable injection scope for tenant segmentation (configured by default)
- Per-Request injection scope for tenant segmentation (commented by default, only better for large number of tenants)
- Route guards with "@Public" decorator available for public controllers/routes
- Basic Postgres error handling
- Basic mechanism for loading fixtures (static data)
- Docker configuration for database and app execution
- CLI interface for NestJS via `yarn shell`

All requests for tenant-specific data must have a valid tenantId (used as schema name) assigned to the `x-tenant-id` header.
In a production application, this should be properly validated before returning data (e.g. JWT field, validate auth, etc.)

## Project setup

Install dependencies:

```bash
$ yarn install
```

Create a .env file at the project root with the following:

```bash
BACKEND_VERSION=0.0.0-0
DATABASE_NAME=nestjs_drizzle_multitenancy_db
DATABASE_HOST=db
DATABASE_USER=developer
DATABASE_PASSWORD=password
DATABASE_PORT=5432
TEST_DATABASE_HOST=localhost
TEST_DATABASE_USER=developer
TEST_DATABASE_PASSWORD=password
TEST_DATABASE_NAME=test_nestjs_drizzle_multitenancy_db
TEST_DATABASE_PORT=5431
DEBUG_NEST=false
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Migrations

```bash
# generate migrations for shared schema
$ yarn generate:shared

# generate migrations for tenant schema
$ yarn generate:tenant

# migrate shared schema
$ yarn migrate:shared

# migrate tenant schema
$ yarn migrate:tenant
```

## Fixtures

```bash
# load data from fixtures
$ yarn loaddata
```

## License

This project is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
