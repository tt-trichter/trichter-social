import { Sql } from "postgres";

export const getRunsQuery = `-- name: GetRuns :many
SELECT id, user_id, data, created_at, image FROM runs
ORDER BY created_at DESC`;

export interface GetRunsRow {
    id: string;
    userId: string;
    data: any;
    createdAt: Date;
    image: string;
}

export async function getRuns(sql: Sql): Promise<GetRunsRow[]> {
    return (await sql.unsafe(getRunsQuery, []).values()).map(row => ({
        id: row[0],
        userId: row[1],
        data: row[2],
        createdAt: row[3],
        image: row[4]
    }));
}

export const saveRunQuery = `-- name: SaveRun :one
INSERT INTO runs (user_id, data, image, created_at)
VALUES ($1, $2, $3, NOW())
RETURNING id, user_id, data, created_at, image`;

export interface SaveRunArgs {
    userId: string;
    data: any;
    image: string;
}

export interface SaveRunRow {
    id: string;
    userId: string;
    data: any;
    createdAt: Date;
    image: string;
}

export async function saveRun(sql: Sql, args: SaveRunArgs): Promise<SaveRunRow | null> {
    const rows = await sql.unsafe(saveRunQuery, [args.userId, args.data, args.image]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        userId: row[1],
        data: row[2],
        createdAt: row[3],
        image: row[4]
    };
}

export const getAllRunsWithUsersQuery = `-- name: GetAllRunsWithUsers :many
SELECT 
    r.id, 
    r.data, 
    r.image, 
    r.created_at,
    u.id as user_id,
    u.name as user_name,
    u.displayusername as user_username
FROM runs r
LEFT JOIN "user" u ON r.user_id = u.id
WHERE NOT r.deleted
ORDER BY r.created_at DESC`;

export interface GetAllRunsWithUsersRow {
    id: string;
    data: any;
    image: string;
    createdAt: Date;
    userId: string | null;
    userName: string | null;
    userUsername: string | null;
}

export async function getAllRunsWithUsers(sql: Sql): Promise<GetAllRunsWithUsersRow[]> {
    return (await sql.unsafe(getAllRunsWithUsersQuery, []).values()).map(row => ({
        id: row[0],
        data: row[1],
        image: row[2],
        createdAt: row[3],
        userId: row[4],
        userName: row[5],
        userUsername: row[6]
    }));
}

export const updateRunWithUserQuery = `-- name: UpdateRunWithUser :one
UPDATE runs 
SET user_id = $2
WHERE id = $1
RETURNING id, user_id, data, created_at, image`;

export interface UpdateRunWithUserArgs {
    id: string;
    userId: string;
}

export interface UpdateRunWithUserRow {
    id: string;
    userId: string;
    data: any;
    createdAt: Date;
    image: string;
}

export async function updateRunWithUser(sql: Sql, args: UpdateRunWithUserArgs): Promise<UpdateRunWithUserRow | null> {
    const rows = await sql.unsafe(updateRunWithUserQuery, [args.id, args.userId]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        userId: row[1],
        data: row[2],
        createdAt: row[3],
        image: row[4]
    };
}

export const deleteRunQuery = `-- name: DeleteRun :exec
DELETE FROM runs WHERE id = $1`;

export interface DeleteRunArgs {
    id: string;
}

export async function deleteRun(sql: Sql, args: DeleteRunArgs): Promise<void> {
    await sql.unsafe(deleteRunQuery, [args.id]);
}

export const getRunsByUserIdQuery = `-- name: GetRunsByUserId :many
SELECT id, user_id, data, created_at, image 
FROM runs 
WHERE user_id = $1
ORDER BY created_at DESC`;

export interface GetRunsByUserIdArgs {
    userId: string;
}

export interface GetRunsByUserIdRow {
    id: string;
    userId: string;
    data: any;
    createdAt: Date;
    image: string;
}

export async function getRunsByUserId(sql: Sql, args: GetRunsByUserIdArgs): Promise<GetRunsByUserIdRow[]> {
    return (await sql.unsafe(getRunsByUserIdQuery, [args.userId]).values()).map(row => ({
        id: row[0],
        userId: row[1],
        data: row[2],
        createdAt: row[3],
        image: row[4]
    }));
}

export const getRecentRunsForUserQuery = `-- name: GetRecentRunsForUser :many
SELECT id, user_id, data, created_at, image 
FROM runs 
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT $2`;

export interface GetRecentRunsForUserArgs {
    userId: string;
    limit: string;
}

export interface GetRecentRunsForUserRow {
    id: string;
    userId: string;
    data: any;
    createdAt: Date;
    image: string;
}

export async function getRecentRunsForUser(sql: Sql, args: GetRecentRunsForUserArgs): Promise<GetRecentRunsForUserRow[]> {
    return (await sql.unsafe(getRecentRunsForUserQuery, [args.userId, args.limit]).values()).map(row => ({
        id: row[0],
        userId: row[1],
        data: row[2],
        createdAt: row[3],
        image: row[4]
    }));
}

export const getUserByIdQuery = `-- name: GetUserById :one
SELECT id, name, username 
FROM "user" 
WHERE id = $1`;

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
SELECT id, name, username, displayusername
FROM "user"
WHERE name ILIKE '%' || $1 || '%' OR username ILIKE '%' || $1 || '%'
ORDER BY name
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

