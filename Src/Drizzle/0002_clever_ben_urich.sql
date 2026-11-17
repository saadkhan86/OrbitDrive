DROP INDEX "messages_conversation_created_idx";--> statement-breakpoint
CREATE INDEX "tasts_org_createdAt_idx" ON "tasks" USING btree ("created_at","organization_id","id");--> statement-breakpoint
CREATE INDEX "messages_conversation_created_idx" ON "messages" USING btree ("id","conversation_id","created_at");