CREATE TABLE `exercise` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`muscle_group` text NOT NULL,
	`movement_pattern` text NOT NULL,
	`minimum_lifting_experience` text DEFAULT 'none' NOT NULL,
	`movement_pattern_priority` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exercise_name_unique` ON `exercise` (`name`);--> statement-breakpoint
CREATE TABLE `mesocycle` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`is_confirmed` integer NOT NULL,
	`finished_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `mesocycle_user_id_idx` ON `mesocycle` (`user_id`);--> statement-breakpoint
CREATE TABLE `microcycle` (
	`id` text PRIMARY KEY NOT NULL,
	`mesocycle_id` text NOT NULL,
	`index` integer NOT NULL,
	`finished_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`mesocycle_id`) REFERENCES `mesocycle`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `microcycle_mesocycle_id_idx` ON `microcycle` (`mesocycle_id`);--> statement-breakpoint
CREATE TABLE `microcycle_workout` (
	`id` text PRIMARY KEY NOT NULL,
	`microcycle_id` text NOT NULL,
	`day_index` integer NOT NULL,
	`state` text NOT NULL,
	`active` integer NOT NULL,
	`completed_at` integer,
	`sleep_quality` integer,
	`diet_quality` integer,
	FOREIGN KEY (`microcycle_id`) REFERENCES `microcycle`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `microcycle_workout_microcycle_id_idx` ON `microcycle_workout` (`microcycle_id`);--> statement-breakpoint
CREATE TABLE `onboarding_data` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`unit` text NOT NULL,
	`training_frequency` text NOT NULL,
	`training_days` integer NOT NULL,
	`lifting_experience` text NOT NULL,
	`muscle_group_preference` text,
	`gender` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `onboarding_data_user_id_unique` ON `onboarding_data` (`user_id`);--> statement-breakpoint
CREATE TABLE `strength_test` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`upper_front_index` real NOT NULL,
	`upper_front_reps` text NOT NULL,
	`upper_back_index` real NOT NULL,
	`upper_back_reps` text NOT NULL,
	`lower_front_index` real NOT NULL,
	`lower_front_reps` text NOT NULL,
	`lower_back_index` real NOT NULL,
	`lower_back_reps` text NOT NULL,
	`tested_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `strength_test_user_id_idx` ON `strength_test` (`user_id`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`asked_for_strength_test` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `workout_exercise` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`state` text NOT NULL,
	`target_reps` integer NOT NULL,
	`target_sets` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	`loaded_weight` real,
	`testing_weight` real,
	`loaded_reps` integer,
	`progression_type` text,
	`order_index` integer NOT NULL,
	`assesment` text,
	`hard_assesment_tag` text,
	FOREIGN KEY (`workout_id`) REFERENCES `microcycle_workout`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercise`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `workout_exercise_workout_id_idx` ON `workout_exercise` (`workout_id`);--> statement-breakpoint
CREATE INDEX `workout_exercise_exercise_id_idx` ON `workout_exercise` (`exercise_id`);--> statement-breakpoint
CREATE TABLE `workout_exercise_set` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_exercise_id` text NOT NULL,
	`state` text NOT NULL,
	`order_index` integer NOT NULL,
	`reps` integer NOT NULL,
	`weight` real NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`workout_exercise_id`) REFERENCES `workout_exercise`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `workout_exercise_set_workout_exercise_id_idx` ON `workout_exercise_set` (`workout_exercise_id`);