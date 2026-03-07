ALTER TABLE `exercise` RENAME COLUMN `equipment_type` TO `loading_type`;--> statement-breakpoint
UPDATE `exercise` SET `loading_type` = 'stack' WHERE `loading_type` = 'machine';--> statement-breakpoint
UPDATE `exercise` SET `loading_type` = 'double_plates' WHERE `loading_type` = 'barbell';--> statement-breakpoint
UPDATE `exercise` SET `loading_type` = 'plates' WHERE `name` IN ('Diamond Pushups', 'Chest Dips', 'Decline Sit Up', 'Decline Russian Twist');
