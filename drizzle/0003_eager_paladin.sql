CREATE TABLE IF NOT EXISTS "skinport_items" (
	"market_hash_name" varchar(255) PRIMARY KEY NOT NULL,
	"currency" varchar(3) DEFAULT 'EUR' NOT NULL,
	"suggested_price" numeric(10, 2),
	"market_page" varchar,
	"item_page" varchar,
	"min_price" numeric(10, 2),
	"max_price" numeric(10, 2),
	"mean_price" numeric(10, 2),
	"median_price" numeric(10, 2),
	"quantity" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "balance" SET DATA TYPE numeric(10, 2);