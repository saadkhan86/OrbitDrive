ALTER TABLE "users" ALTER COLUMN "profile" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "profile" SET DEFAULT '{"avatar":null,"bio":null}'::jsonb;