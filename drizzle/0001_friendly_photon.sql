CREATE TABLE "message_movies" (
	"messageId" uuid,
	"movieId" uuid,
	"createdAt" date DEFAULT now(),
	CONSTRAINT "message_movies_messageId_movieId_pk" PRIMARY KEY("messageId","movieId")
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"messageId" uuid PRIMARY KEY NOT NULL,
	"threadId" uuid,
	"content" text,
	"model" text,
	"role" text,
	"createdAt" date DEFAULT now(),
	"updatedAt" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "movies" (
	"movieId" uuid PRIMARY KEY NOT NULL,
	"tmdbId" integer NOT NULL,
	"title" text,
	"releaseDate" date,
	"posterPath" text,
	"backdropPath" text,
	"createdAt" date DEFAULT now(),
	CONSTRAINT "movies_tmdbId_unique" UNIQUE("tmdbId")
);
--> statement-breakpoint
CREATE TABLE "threads" (
	"threadId" uuid PRIMARY KEY NOT NULL,
	"ownerId" uuid,
	"title" text,
	"createdAt" date DEFAULT now(),
	"updatedAt" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_movies" (
	"userId" uuid,
	"movieId" uuid,
	"watched" boolean DEFAULT false,
	"watchlist" boolean DEFAULT false,
	"ignore" boolean DEFAULT false,
	"createdAt" date DEFAULT now(),
	"updatedAt" date DEFAULT now(),
	CONSTRAINT "user_movies_userId_movieId_pk" PRIMARY KEY("userId","movieId")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"userId" uuid PRIMARY KEY NOT NULL,
	"anon" boolean DEFAULT true,
	"createdAt" date DEFAULT now(),
	"updatedAt" date DEFAULT now()
);
--> statement-breakpoint
DROP TABLE "schema_v1"."messages" CASCADE;--> statement-breakpoint
DROP TABLE "schema_v1"."threads" CASCADE;--> statement-breakpoint
DROP TABLE "schema_v1"."users" CASCADE;--> statement-breakpoint
ALTER TABLE "message_movies" ADD CONSTRAINT "message_movies_messageId_messages_messageId_fk" FOREIGN KEY ("messageId") REFERENCES "public"."messages"("messageId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_movies" ADD CONSTRAINT "message_movies_movieId_movies_movieId_fk" FOREIGN KEY ("movieId") REFERENCES "public"."movies"("movieId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_threadId_threads_threadId_fk" FOREIGN KEY ("threadId") REFERENCES "public"."threads"("threadId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "threads" ADD CONSTRAINT "threads_ownerId_users_userId_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("userId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_movies" ADD CONSTRAINT "user_movies_userId_users_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("userId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_movies" ADD CONSTRAINT "user_movies_movieId_movies_movieId_fk" FOREIGN KEY ("movieId") REFERENCES "public"."movies"("movieId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
DROP SCHEMA "schema_v1";
