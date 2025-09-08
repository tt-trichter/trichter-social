CREATE TABLE "user" (
    "id" text NOT NULL PRIMARY KEY,
    "name" text NOT NULL,
    "email" text NOT NULL UNIQUE,
    "emailVerified" boolean NOT NULL,
    "image" text,
    "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "role" text,
    "banned" boolean,
    "banReason" text,
    "banExpires" timestamp,
    "username" text UNIQUE,
    "displayUsername" text
);

CREATE TABLE "session" (
    "id" text NOT NULL PRIMARY KEY,
    "expiresAt" timestamp NOT NULL,
    "token" text NOT NULL UNIQUE,
    "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "userId" text NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "impersonatedBy" text
);

CREATE TABLE "account" (
    "id" text NOT NULL PRIMARY KEY,
    "accountId" text NOT NULL,
    "providerId" text NOT NULL,
    "userId" text NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "accessToken" text,
    "refreshToken" text,
    "idToken" text,
    "accessTokenExpiresAt" timestamp,
    "refreshTokenExpiresAt" timestamp,
    "scope" text,
    "password" text,
    "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp NOT NULL
);

CREATE TABLE "verification" (
    "id" text NOT NULL PRIMARY KEY,
    "identifier" text NOT NULL,
    "value" text NOT NULL,
    "expiresAt" timestamp NOT NULL,
    "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX "user_username_idkx" ON "user" USING gin ("username" gin_trgm_ops);

CREATE OR REPLACE FUNCTION set_username_if_null ()
    RETURNS TRIGGER
    AS $$
BEGIN
    IF NEW.username IS NULL THEN
        NEW.username := LOWER(REPLACE(NEW.name, ' ', '_'));
        NEW.displayusername := NEW.username;
    END IF;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_username
    BEFORE INSERT OR UPDATE ON "user"
    FOR EACH ROW
    EXECUTE FUNCTION set_username_if_null ();

