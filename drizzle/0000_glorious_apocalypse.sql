CREATE TABLE `exercise` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`instructions` text,
	`url` text,
	`user_id` text NOT NULL
);

CREATE TABLE `exercise_session` (
	`id` integer PRIMARY KEY NOT NULL,
	`exercise_id` integer NOT NULL,
	`session_id` integer NOT NULL,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercise`(`id`),
	FOREIGN KEY (`session_id`) REFERENCES `session`(`id`)
);

CREATE TABLE `session` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`user_id` text NOT NULL
);
