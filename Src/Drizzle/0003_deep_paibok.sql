DROP INDEX "tasts_org_createdAt_idx";--> statement-breakpoint
CREATE INDEX "activities_created_at_table_id_idx" ON "activities" USING btree ("created_at","id");--> statement-breakpoint
CREATE INDEX "audit_log_created_at_id_idx" ON "audit_logs" USING btree ("id","created_at");--> statement-breakpoint
CREATE INDEX "conversation_member_joined_at_idx" ON "conversation_members" USING btree ("joined_at","id");--> statement-breakpoint
CREATE INDEX "conversation_id_created_at_idx" ON "chats" USING btree ("id","created_at");--> statement-breakpoint
CREATE INDEX "notification_created_at_id_idx" ON "notifications" USING btree ("id","created_at");--> statement-breakpoint
CREATE INDEX "tasks_org_createdAt_idx" ON "tasks" USING btree ("created_at","organization_id","id");--> statement-breakpoint
CREATE INDEX "user_createdAt_idx" ON "users" USING btree ("id","created_at");