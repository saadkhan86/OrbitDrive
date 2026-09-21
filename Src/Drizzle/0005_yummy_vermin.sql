CREATE TABLE "organization_invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdBy" uuid NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" "organization_member_role" DEFAULT 'MEMBER' NOT NULL,
	"tokenHash" varchar(64) NOT NULL,
	"expiresAt" timestamp with time zone DEFAULT now(),
	"acceptedAt" timestamp with time zone DEFAULT now(),
	"createdAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "organization_invitations_tokenHash_unique" UNIQUE("tokenHash")
);
--> statement-breakpoint
ALTER TABLE "organization_invitations" ADD CONSTRAINT "organization_invitations_createdBy_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;