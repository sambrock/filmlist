CREATE TABLE `list_movies` (
	`listId` integer NOT NULL,
	`movieId` integer NOT NULL,
	`order` integer NOT NULL,
	`userPosterPath` text,
	`createdAt` integer,
	FOREIGN KEY (`listId`) REFERENCES `lists`(`listId`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`movieId`) REFERENCES `movies`(`movieId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `lists` (
	`listId` integer PRIMARY KEY NOT NULL,
	`editId` text(24) NOT NULL,
	`readId` text(12) NOT NULL,
	`clientId` text(32) NOT NULL,
	`title` text(100) NOT NULL,
	`description` text(500) DEFAULT '' NOT NULL,
	`locked` integer DEFAULT false NOT NULL,
	`lastUpdate` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `lists_editId_unique` ON `lists` (`editId`);--> statement-breakpoint
CREATE UNIQUE INDEX `lists_readId_unique` ON `lists` (`readId`);--> statement-breakpoint
CREATE TABLE `movies` (
	`movieId` integer PRIMARY KEY NOT NULL,
	`tmdbId` integer NOT NULL,
	`title` text NOT NULL,
	`posterPath` text NOT NULL,
	`releaseDate` text NOT NULL,
	`createdAt` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `movies_tmdbId_unique` ON `movies` (`tmdbId`);