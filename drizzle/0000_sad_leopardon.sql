CREATE TABLE "library" (
	"user_id" uuid NOT NULL,
	"movie_id" uuid NOT NULL,
	"watched" boolean DEFAULT false,
	"liked" boolean DEFAULT false,
	"watchlist" boolean DEFAULT false,
	"ignore" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "library_user_id_movie_id_pk" PRIMARY KEY("user_id","movie_id")
);
--> statement-breakpoint
CREATE TABLE "message_movies" (
	"message_id" uuid NOT NULL,
	"movie_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "message_movies_message_id_movie_id_pk" PRIMARY KEY("message_id","movie_id")
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"message_id" uuid PRIMARY KEY NOT NULL,
	"thread_id" uuid NOT NULL,
	"parent_id" uuid,
	"serial" serial NOT NULL,
	"content" text NOT NULL,
	"model" text NOT NULL,
	"role" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "movies" (
	"movie_id" uuid PRIMARY KEY NOT NULL,
	"tmdb_id" integer NOT NULL,
	"title" text NOT NULL,
	"release_date" date NOT NULL,
	"poster_path" text NOT NULL,
	"backdrop_path" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "movies_tmdb_id_unique" UNIQUE("tmdb_id")
);
--> statement-breakpoint
CREATE TABLE "threads" (
	"thread_id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"model" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"anon" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "library" ADD CONSTRAINT "library_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "library" ADD CONSTRAINT "library_movie_id_movies_movie_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("movie_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_movies" ADD CONSTRAINT "message_movies_message_id_messages_message_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("message_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_movies" ADD CONSTRAINT "message_movies_movie_id_movies_movie_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("movie_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_thread_id_threads_thread_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("thread_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "threads" ADD CONSTRAINT "threads_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;