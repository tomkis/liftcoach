CREATE TABLE `exercise_metadata` (
	`id` text PRIMARY KEY NOT NULL,
	`exercise_id` text NOT NULL,
	`movement_pattern` text NOT NULL,
	`movement_pattern_priority` integer NOT NULL,
	`minimum_lifting_experience` text DEFAULT 'none' NOT NULL,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercise`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exercise_metadata_exercise_id_unique` ON `exercise_metadata` (`exercise_id`);--> statement-breakpoint
INSERT INTO `exercise_metadata` (`id`, `exercise_id`, `movement_pattern`, `movement_pattern_priority`, `minimum_lifting_experience`)
SELECT `id` || '-metadata', `id`, `movement_pattern`, `movement_pattern_priority`, `minimum_lifting_experience` FROM `exercise`;--> statement-breakpoint
ALTER TABLE `exercise` DROP COLUMN `movement_pattern`;--> statement-breakpoint
ALTER TABLE `exercise` DROP COLUMN `minimum_lifting_experience`;--> statement-breakpoint
ALTER TABLE `exercise` DROP COLUMN `movement_pattern_priority`;