CREATE TABLE `list_movies` (
	`listId` integer NOT NULL,
	`movieId` integer NOT NULL,
	`order` integer NOT NULL,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`listId`) REFERENCES `lists`(`listId`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`movieId`) REFERENCES `movies`(`movieId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `lists` (
	`listId` integer PRIMARY KEY NOT NULL,
	`readId` text(12) NOT NULL,
	`editId` text(22) NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`locked` integer DEFAULT false NOT NULL,
	`owner` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`lastUpdate` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `lists_readId_unique` ON `lists` (`readId`);--> statement-breakpoint
CREATE UNIQUE INDEX `lists_editId_unique` ON `lists` (`editId`);--> statement-breakpoint
CREATE TABLE `movies` (
	`movieId` integer PRIMARY KEY NOT NULL,
	`tmdbId` integer NOT NULL,
	`title` text NOT NULL,
	`posterPath` text NOT NULL,
	`releaseDate` text NOT NULL,
	`slug` text NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `movies_tmdbId_unique` ON `movies` (`tmdbId`);--> statement-breakpoint
CREATE UNIQUE INDEX `movies_slug_unique` ON `movies` (`slug`);