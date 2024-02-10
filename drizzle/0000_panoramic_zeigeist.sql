CREATE TABLE `exercise` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`instructions` text,
	`url` text,
	`user_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `exercise_template` (
	`id` integer PRIMARY KEY NOT NULL,
	`todo` text,
	`exercise_id` integer NOT NULL,
	`template_id` integer NOT NULL,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercise`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`template_id`) REFERENCES `template`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sets` (
	`id` integer PRIMARY KEY NOT NULL,
	`reps` integer,
	`weight` integer,
	`workout_exercise_id` integer NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`workout_exercise_id`) REFERENCES `workout_exercise`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `template` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`user_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `workout` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`date` text DEFAULT CURRENT_DATE,
	`started` text,
	`finished` text,
	`comment` text,
	`user_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `workout_exercise` (
	`id` integer PRIMARY KEY NOT NULL,
	`todo` text,
	`comment` text,
	`workout_id` integer NOT NULL,
	`exercise_id` integer NOT NULL,
	FOREIGN KEY (`workout_id`) REFERENCES `workout`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercise`(`id`) ON UPDATE no action ON DELETE no action
);
