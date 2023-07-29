CREATE TABLE `sets` (
	`id` integer PRIMARY KEY NOT NULL,
	`reps` integer,
	`weight` integer,
	`workout_exercise_id` integer NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`workout_exercise_id`) REFERENCES `workout_exercise`(`id`)
);

CREATE TABLE `workout` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`date` text NOT NULL,
	`started` text,
	`finished` text,
	`comment` text,
	`user_id` text NOT NULL
);

CREATE TABLE `workout_exercise` (
	`id` integer PRIMARY KEY NOT NULL,
	`comment` text,
	`workout_id` integer NOT NULL,
	`exercise_id` integer NOT NULL,
	FOREIGN KEY (`workout_id`) REFERENCES `workout`(`id`),
	FOREIGN KEY (`exercise_id`) REFERENCES `exercise`(`id`)
);
