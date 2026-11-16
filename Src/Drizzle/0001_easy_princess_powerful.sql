ALTER TABLE "clients" DROP CONSTRAINT "clients_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "clients" DROP COLUMN "created_by";