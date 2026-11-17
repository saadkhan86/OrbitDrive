ALTER TABLE "clients" DROP CONSTRAINT "clients_email_unique";--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "org_client_email_unique" UNIQUE("email","organization_id");