CREATE TABLE `LIST_MOVIES` (
	`LISTID` INTEGER,
	`MOVIEID` INTEGER,
	`ORDER` INTEGER NOT NULL,
	`CREATEDAT` TEXT DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`LISTID`) REFERENCES `LISTS`(`ID`) ON UPDATE NO ACTION ON DELETE NO ACTION,
	FOREIGN KEY (`MOVIEID`) REFERENCES `MOVIES`(`ID`) ON UPDATE NO ACTION ON DELETE NO ACTION
);

--> statement-breakpoint
CREATE TABLE `LISTS` (
	`ID` INTEGER PRIMARY KEY NOT NULL,
	`PUBLICID` TEXT(12),
	`TITLE` TEXT,
	`CREATEDAT` TEXT DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`UPDATEDAT` TEXT DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);

--> statement-breakpoint
CREATE UNIQUE INDEX `LISTS_PUBLICID_UNIQUE` ON `LISTS` (`PUBLICID`);

--> statement-breakpoint
CREATE TABLE `MOVIES` (
	`ID` INTEGER PRIMARY KEY NOT NULL,
	`TMDBID` INTEGER NOT NULL,
	`TITLE` TEXT NOT NULL,
	`BACKDROPPATH` TEXT NOT NULL,
	`POSTERPATH` TEXT NOT NULL,
	`OVERVIEW` TEXT NOT NULL,
	`RELEASEDATE` TEXT DEFAULT (CURRENT_DATE) NOT NULL,
	`CREATEDAT` TEXT DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`UPDATEDAT` TEXT DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);

--> statement-breakpoint
CREATE UNIQUE INDEX `MOVIES_TMDBID_UNIQUE` ON `MOVIES` (`TMDBID`);