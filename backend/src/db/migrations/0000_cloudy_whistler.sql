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
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item_masters" (
	"sku" varchar(100) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category_id" text,
	"brand_id" text,
	"model" text,
	"specification" text,
	"unit" varchar(20),
	"unit_price" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"supplier_id" text,
	"build_out_at" timestamp with time zone,
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
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item_stocks" (
	"code" varchar(50) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
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
	CONSTRAINT "item_stock_unique_idx" UNIQUE("code","store_code","item_sku")
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
ALTER TABLE "item_images" ADD CONSTRAINT "item_images_item_master_id_item_masters_sku_fk" FOREIGN KEY ("item_master_id") REFERENCES "public"."item_masters"("sku") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_masters" ADD CONSTRAINT "item_masters_category_id_item_categories_code_fk" FOREIGN KEY ("category_id") REFERENCES "public"."item_categories"("code") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_masters" ADD CONSTRAINT "item_masters_brand_id_item_brands_code_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."item_brands"("code") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_masters" ADD CONSTRAINT "item_masters_unit_item_units_code_fk" FOREIGN KEY ("unit") REFERENCES "public"."item_units"("code") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_masters" ADD CONSTRAINT "item_masters_supplier_id_item_suppliers_code_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."item_suppliers"("code") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items_documents" ADD CONSTRAINT "items_documents_item_master_id_item_masters_sku_fk" FOREIGN KEY ("item_master_id") REFERENCES "public"."item_masters"("sku") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_stocks" ADD CONSTRAINT "item_stocks_item_sku_item_masters_sku_fk" FOREIGN KEY ("item_sku") REFERENCES "public"."item_masters"("sku") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_stocks" ADD CONSTRAINT "item_stocks_store_code_store_masters_code_fk" FOREIGN KEY ("store_code") REFERENCES "public"."store_masters"("code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "item_stock_code_idx" ON "item_stocks" USING btree ("code");--> statement-breakpoint
CREATE INDEX "item_stock_store_code_idx" ON "item_stocks" USING btree ("store_code");--> statement-breakpoint
CREATE INDEX "item_stock_item_sku_idx" ON "item_stocks" USING btree ("item_sku");