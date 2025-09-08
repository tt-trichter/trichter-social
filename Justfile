default:
    @just --list

db_migrate:
    #!/usr/bin/env bash
    source .env
    migrate -database $DATABASE_URL -path db/migrations up

db_gen:
    sqlc generate
