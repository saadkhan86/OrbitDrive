ALTER TABLE "tasks" DROP CONSTRAINT "tasks_client_id_clients_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_client_org_fk" FOREIGN KEY ("client_id","organization_id") REFERENCES "public"."clients"("id","organization_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_deal_org_fk" FOREIGN KEY ("deal_id","organization_id") REFERENCES "public"."deals"("id","organization_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "assigned_usr_org_id_fk" FOREIGN KEY ("organization_id","assigned_to") REFERENCES "public"."organization_members"("id","user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deals" ADD CONSTRAINT "deals_id_org_unique" UNIQUE("id","organization_id");