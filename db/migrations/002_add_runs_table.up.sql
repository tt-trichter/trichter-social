CREATE TABLE "runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL REFERENCES "user"("id") ON DELETE SET NULL,
	"accepted" boolean DEFAULT false NOT NULL,
	"data" jsonb NOT NULL,
	"createdAt" timestamp NOT NULL,
	"image" text,
	"deleted" boolean DEFAULT false NOT NULL
);

CREATE OR REPLACE FUNCTION mark_runs_as_deleted_on_user_delete()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE runs
        SET deleted = TRUE
        WHERE runs.user_id = OLD.id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_mark_runs_deleted
    BEFORE DELETE ON "user"
    FOR EACH ROW
    EXECUTE FUNCTION mark_runs_as_deleted_on_user_delete();
