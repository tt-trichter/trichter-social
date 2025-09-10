import { Sql } from "postgres";

export const saveRunQuery = `-- name: SaveRun :one
INSERT INTO runs ("userId", "data", "image", "createdAt")
VALUES ($1, $2, $3, NOW())
RETURNING "id", "userId", "data", "createdAt", "image"`;

export interface SaveRunArgs {
    userid: string;
    data: any;
    image: string | null;
}

export interface SaveRunRow {
    id: string;
    userid: string;
    data: any;
    createdat: Date;
    image: string | null;
}

export async function saveRun(sql: Sql, args: SaveRunArgs): Promise<SaveRunRow | null> {
    const rows = await sql.unsafe(saveRunQuery, [args.userid, args.data, args.image]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        userid: row[1],
        data: row[2],
        createdat: row[3],
        image: row[4]
    };
}

export const getAllRunsWithUsersQuery = `-- name: GetAllRunsWithUsers :many
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
ORDER BY r."createdAt" DESC`;

export interface GetAllRunsWithUsersRow {
    id: string;
    data: any;
    image: string | null;
    createdat: Date;
    userid: string | null;
    userName: string | null;
    userUsername: string | null;
}

export async function getAllRunsWithUsers(sql: Sql): Promise<GetAllRunsWithUsersRow[]> {
    return (await sql.unsafe(getAllRunsWithUsersQuery, []).values()).map(row => ({
        id: row[0],
        data: row[1],
        image: row[2],
        createdat: row[3],
        userid: row[4],
        userName: row[5],
        userUsername: row[6]
    }));
}

export const deleteRunQuery = `-- name: DeleteRun :exec
UPDATE runs
SET "deleted" = true
WHERE "id" = $1`;

export interface DeleteRunArgs {
    id: string;
}

export async function deleteRun(sql: Sql, args: DeleteRunArgs): Promise<void> {
    await sql.unsafe(deleteRunQuery, [args.id]);
}

export const getRunsByUserIdQuery = `-- name: GetRunsByUserId :many
SELECT "id", "userId", "data", "createdAt", "image" 
FROM runs 
WHERE "userId" = $1
ORDER BY "createdAt" DESC`;

export interface GetRunsByUserIdArgs {
    userid: string;
}

export interface GetRunsByUserIdRow {
    id: string;
    userid: string;
    data: any;
    createdat: Date;
    image: string | null;
}

export async function getRunsByUserId(sql: Sql, args: GetRunsByUserIdArgs): Promise<GetRunsByUserIdRow[]> {
    return (await sql.unsafe(getRunsByUserIdQuery, [args.userid]).values()).map(row => ({
        id: row[0],
        userid: row[1],
        data: row[2],
        createdat: row[3],
        image: row[4]
    }));
}

export const getRecentRunsForUserQuery = `-- name: GetRecentRunsForUser :many
SELECT "id", "userId", "data", "createdAt", "image" 
FROM runs 
WHERE "userId" = $1
ORDER BY "createdAt" DESC
LIMIT $2`;

export interface GetRecentRunsForUserArgs {
    userid: string;
    limit: string;
}

export interface GetRecentRunsForUserRow {
    id: string;
    userid: string;
    data: any;
    createdat: Date;
    image: string | null;
}

export async function getRecentRunsForUser(sql: Sql, args: GetRecentRunsForUserArgs): Promise<GetRecentRunsForUserRow[]> {
    return (await sql.unsafe(getRecentRunsForUserQuery, [args.userid, args.limit]).values()).map(row => ({
        id: row[0],
        userid: row[1],
        data: row[2],
        createdat: row[3],
        image: row[4]
    }));
}

export const getUserByIdQuery = `-- name: GetUserById :one
SELECT "id", "name", "username" 
FROM "user" 
WHERE "id" = $1`;

export interface GetUserByIdArgs {
    id: string;
}

export interface GetUserByIdRow {
    id: string;
    name: string;
    username: string | null;
}

export async function getUserById(sql: Sql, args: GetUserByIdArgs): Promise<GetUserByIdRow | null> {
    const rows = await sql.unsafe(getUserByIdQuery, [args.id]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        name: row[1],
        username: row[2]
    };
}

export const searchUsersByNameQuery = `-- name: SearchUsersByName :many
SELECT "id", "name", "username", "displayUsername"
FROM "user"
WHERE "name" ILIKE '%' || $1 || '%' OR "username" ILIKE '%' || $1 || '%'
ORDER BY "name"
LIMIT $2`;

export interface SearchUsersByNameArgs {
    : string | null;
    limit: string;
}

export interface SearchUsersByNameRow {
    id: string;
    name: string;
    username: string | null;
    displayusername: string | null;
}

export async function searchUsersByName(sql: Sql, args: SearchUsersByNameArgs): Promise<SearchUsersByNameRow[]> {
    return (await sql.unsafe(searchUsersByNameQuery, [args., args.limit]).values()).map(row => ({
        id: row[0],
        name: row[1],
        username: row[2],
        displayusername: row[3]
    }));
}

