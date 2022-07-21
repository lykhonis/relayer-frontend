ALTER TABLE IF EXISTS public.tasks DROP COLUMN IF EXISTS uuid;
ALTER TABLE IF EXISTS public.tasks DROP CONSTRAINT IF EXISTS tasks_uuid_check;
DROP INDEX IF EXISTS public.tasks_uuid_idx;
