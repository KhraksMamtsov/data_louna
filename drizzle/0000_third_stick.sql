CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"password" varchar(10) NOT NULL,
	"balance" numeric DEFAULT '0.00' NOT NULL
);
