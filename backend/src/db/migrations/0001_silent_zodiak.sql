CREATE TABLE "permission_groups" (
	"code" varchar(20) PRIMARY KEY NOT NULL,
	"permissions_key" varchar(50),
	"name" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"key" varchar(50) PRIMARY KEY NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "user_permissions" (
	"user_id" uuid,
	"permission_key" varchar(50),
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_store" (
	"user_id" uuid,
	"store_code" varchar(20),
	CONSTRAINT "user_store_user_id_store_code_pk" PRIMARY KEY("user_id","store_code")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "permission_groups" ADD CONSTRAINT "permission_groups_permissions_key_permissions_key_fk" FOREIGN KEY ("permissions_key") REFERENCES "public"."permissions"("key") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_permission_key_permissions_key_fk" FOREIGN KEY ("permission_key") REFERENCES "public"."permissions"("key") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_store" ADD CONSTRAINT "user_store_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_store" ADD CONSTRAINT "user_store_store_code_store_masters_code_fk" FOREIGN KEY ("store_code") REFERENCES "public"."store_masters"("code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_permissions_user_id_idx" ON "user_permissions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_store_user_id_idx" ON "user_store" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_store_store_code_idx" ON "user_store" USING btree ("store_code");