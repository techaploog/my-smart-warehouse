CREATE TABLE "item_brands" (
	"code" varchar(20) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item_categories" (
	"code" varchar(20) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item_images" (
	"key" varchar(100) PRIMARY KEY NOT NULL,
	"seq" integer DEFAULT 0 NOT NULL,
	"item_master_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item_masters" (
	"sku" varchar(100) PRIMARY KEY NOT NULL,
	"barcode" text,
	"name" text NOT NULL,
	"description" text,
	"tags" text,
	"category_id" text,
	"brand_id" text,
	"model" text,
	"specification" text,
	"unit" varchar(20),
	"unit_price" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"supplier_id" text,
	"effective_from" timestamp with time zone,
	"effective_to" timestamp with time zone,
	"order_lead_time" integer DEFAULT 0 NOT NULL,
	"remarks" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item_suppliers" (
	"code" varchar(20) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text,
	"phone" text,
	"email" text,
	"website" text,
	"remarks" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item_units" (
	"code" varchar(20) PRIMARY KEY NOT NULL,
	"details" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "items_documents" (
	"key" varchar(100) PRIMARY KEY NOT NULL,
	"seq" integer DEFAULT 0 NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"type" varchar(20) DEFAULT 'pdf' NOT NULL,
	"item_master_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item_stocks" (
	"code" varchar(50),
	"item_sku" text,
	"store_code" text,
	"qty" integer DEFAULT 0 NOT NULL,
	"max_qty" integer DEFAULT 0 NOT NULL,
	"min_qty" integer DEFAULT 0 NOT NULL,
	"reorder_point" integer DEFAULT 0 NOT NULL,
	"safety_stock" integer DEFAULT 0 NOT NULL,
	"remarks" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "item_stocks_code_store_code_item_sku_pk" PRIMARY KEY("code","store_code","item_sku")
);
--> statement-breakpoint
CREATE TABLE "store_masters" (
	"code" varchar(20) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text,
	"phone" text,
	"email" text,
	"remarks" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "group_permissions" (
	"group_code" varchar(20),
	"permission_key" varchar(50),
	CONSTRAINT "group_permissions_group_code_permission_key_pk" PRIMARY KEY("group_code","permission_key")
);
--> statement-breakpoint
CREATE TABLE "groups" (
	"code" varchar(20) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"key" varchar(50) PRIMARY KEY NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "user_groups" (
	"user_id" uuid,
	"group_code" varchar(20),
	CONSTRAINT "user_groups_user_id_group_code_pk" PRIMARY KEY("user_id","group_code")
);
--> statement-breakpoint
CREATE TABLE "user_permissions" (
	"user_id" uuid,
	"permission_key" varchar(50),
	CONSTRAINT "user_permissions_user_id_permission_key_pk" PRIMARY KEY("user_id","permission_key")
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
	"is_active" boolean DEFAULT false NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "item_images" ADD CONSTRAINT "item_images_item_master_id_item_masters_sku_fk" FOREIGN KEY ("item_master_id") REFERENCES "public"."item_masters"("sku") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_masters" ADD CONSTRAINT "item_masters_category_id_item_categories_code_fk" FOREIGN KEY ("category_id") REFERENCES "public"."item_categories"("code") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_masters" ADD CONSTRAINT "item_masters_brand_id_item_brands_code_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."item_brands"("code") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_masters" ADD CONSTRAINT "item_masters_unit_item_units_code_fk" FOREIGN KEY ("unit") REFERENCES "public"."item_units"("code") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_masters" ADD CONSTRAINT "item_masters_supplier_id_item_suppliers_code_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."item_suppliers"("code") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items_documents" ADD CONSTRAINT "items_documents_item_master_id_item_masters_sku_fk" FOREIGN KEY ("item_master_id") REFERENCES "public"."item_masters"("sku") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_stocks" ADD CONSTRAINT "item_stocks_item_sku_item_masters_sku_fk" FOREIGN KEY ("item_sku") REFERENCES "public"."item_masters"("sku") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_stocks" ADD CONSTRAINT "item_stocks_store_code_store_masters_code_fk" FOREIGN KEY ("store_code") REFERENCES "public"."store_masters"("code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_permissions" ADD CONSTRAINT "group_permissions_group_code_groups_code_fk" FOREIGN KEY ("group_code") REFERENCES "public"."groups"("code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_permissions" ADD CONSTRAINT "group_permissions_permission_key_permissions_key_fk" FOREIGN KEY ("permission_key") REFERENCES "public"."permissions"("key") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_groups" ADD CONSTRAINT "user_groups_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_groups" ADD CONSTRAINT "user_groups_group_code_groups_code_fk" FOREIGN KEY ("group_code") REFERENCES "public"."groups"("code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_permission_key_permissions_key_fk" FOREIGN KEY ("permission_key") REFERENCES "public"."permissions"("key") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_store" ADD CONSTRAINT "user_store_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_store" ADD CONSTRAINT "user_store_store_code_store_masters_code_fk" FOREIGN KEY ("store_code") REFERENCES "public"."store_masters"("code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "item_master_barcode_idx" ON "item_masters" USING btree ("barcode");--> statement-breakpoint
CREATE INDEX "item_stock_code_idx" ON "item_stocks" USING btree ("code");--> statement-breakpoint
CREATE INDEX "item_stock_store_code_idx" ON "item_stocks" USING btree ("store_code");--> statement-breakpoint
CREATE INDEX "item_stock_item_sku_idx" ON "item_stocks" USING btree ("item_sku");--> statement-breakpoint
CREATE INDEX "item_stock_store_code_item_sku_idx" ON "item_stocks" USING btree ("store_code","item_sku");--> statement-breakpoint
CREATE INDEX "group_permissions_group_code_idx" ON "group_permissions" USING btree ("group_code");--> statement-breakpoint
CREATE INDEX "user_groups_user_id_idx" ON "user_groups" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_groups_group_code_idx" ON "user_groups" USING btree ("group_code");--> statement-breakpoint
CREATE INDEX "user_permissions_user_id_idx" ON "user_permissions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_store_user_id_idx" ON "user_store" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_store_store_code_idx" ON "user_store" USING btree ("store_code");