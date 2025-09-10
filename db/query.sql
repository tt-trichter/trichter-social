-- name: SaveRun :one
INSERT INTO runs ("userId", "data", "image", "createdAt")
VALUES ($1, $2, $3, NOW())
RETURNING "id", "userId", "data", "createdAt", "image";

-- name: GetAllRunsWithUsers :many
SELECT 
    r."id", 
    r."data", 
    r."image", 
    r."createdAt",
    u."id" as "userId",
    u."name" as "user_name",
    u."displayUsername" as "user_username"
FROM runs r
LEFT JOIN "user" u ON r."userId" = u."id"
WHERE NOT r.deleted AND r.accepted
ORDER BY r."createdAt" DESC;

-- name: DeleteRun :exec
UPDATE runs
SET "deleted" = true
WHERE "id" = $1;

-- name: GetRunsByUserId :many
SELECT "id", "userId", "data", "createdAt", "image" 
FROM runs 
WHERE "userId" = $1
ORDER BY "createdAt" DESC;

-- name: GetRecentRunsForUser :many
SELECT "id", "userId", "data", "createdAt", "image" 
FROM runs 
WHERE "userId" = $1
ORDER BY "createdAt" DESC
LIMIT $2;

-- name: GetUserById :one
SELECT "id", "name", "username" 
FROM "user" 
WHERE "id" = $1;

-- name: SearchUsersByName :many
SELECT "id", "name", "username", "displayUsername"
FROM "user"
WHERE "name" ILIKE '%' || $1 || '%' OR "username" ILIKE '%' || $1 || '%'
ORDER BY "name"
LIMIT $2;
