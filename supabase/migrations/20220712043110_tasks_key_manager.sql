ALTER TABLE IF EXISTS public.tasks
    ADD COLUMN key_manager text COLLATE pg_catalog."default" NOT NULL;
