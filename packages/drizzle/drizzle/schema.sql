CREATE TABLE `likes` (
	`id` integer PRIMARY KEY NOT NULL,
	`userId` integer NOT NULL,
	`movieId` integer NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `movies` (
	`id` integer PRIMARY KEY NOT NULL,
	`tmdbId` integer NOT NULL,
	`title` text NOT NULL,
	`backdropPath` text NOT NULL,
	`posterPath` text NOT NULL,
	`overview` text NOT NULL,
	`releaseDate` text DEFAULT (CURRENT_DATE) NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `movies_tmdbId_unique` ON `movies` (`tmdbId`);--> statement-breakpoint
CREATE TABLE `ratings` (
	`id` integer PRIMARY KEY NOT NULL,
	`userId` integer NOT NULL,
	`movieId` integer NOT NULL,
	`rating` integer NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ratings_userId_movieId_unique` ON `ratings` (`userId`,`movieId`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `watched` (
	`id` integer PRIMARY KEY NOT NULL,
	`userId` integer NOT NULL,
	`movieId` integer NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `watchlist` (
	`id` integer PRIMARY KEY NOT NULL,
	`userId` integer NOT NULL,
	`movieId` integer NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
