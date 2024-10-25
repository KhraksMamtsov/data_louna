ALTER TABLE "skinport_items" RENAME TO "items";--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "balance" numeric(10, 2) DEFAULT '0.00' NOT NULL;--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN IF EXISTS "market_hash_name";--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN IF EXISTS "currency";--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN IF EXISTS "suggested_price";--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN IF EXISTS "market_page";--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN IF EXISTS "item_page";--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN IF EXISTS "min_price";--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN IF EXISTS "max_price";--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN IF EXISTS "mean_price";--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN IF EXISTS "median_price";--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN IF EXISTS "updated_at";