DROP TRIGGER IF EXISTS trigger_mark_runs_deleted ON "user";
DROP FUNCTION IF EXISTS mark_runs_as_deleted_on_user_delete;

DROP TABLE IF EXISTS runs;
