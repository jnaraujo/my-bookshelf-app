ALTER TABLE "session" ADD COLUMN "session_token" text NOT NULL;--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN IF EXISTS "sessionToken";