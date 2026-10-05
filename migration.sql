CREATE TABLE "stories" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"role" text DEFAULT '' NOT NULL,
	"story" text NOT NULL,
	"email" text,
	"approved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"approved_at" timestamp
);
