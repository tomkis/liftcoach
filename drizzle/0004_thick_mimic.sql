PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_workout_exercise_set` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_exercise_id` text NOT NULL,
	`state` text NOT NULL,
	`order_index` integer NOT NULL,
	`reps` integer,
	`weight` real,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`workout_exercise_id`) REFERENCES `workout_exercise`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_workout_exercise_set`("id", "workout_exercise_id", "state", "order_index", "reps", "weight", "created_at", "updated_at") SELECT "id", "workout_exercise_id", "state", "order_index", "reps", "weight", "created_at", "updated_at" FROM `workout_exercise_set`;--> statement-breakpoint
DROP TABLE `workout_exercise_set`;--> statement-breakpoint
ALTER TABLE `__new_workout_exercise_set` RENAME TO `workout_exercise_set`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `workout_exercise_set_workout_exercise_id_idx` ON `workout_exercise_set` (`workout_exercise_id`);--> statement-breakpoint
ALTER TABLE `mesocycle` ADD `progression_mode` text DEFAULT 'liftcoach' NOT NULL;