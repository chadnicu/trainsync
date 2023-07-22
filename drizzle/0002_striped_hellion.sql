ALTER TABLE `exercise_session` RENAME TO `exercise_template`;
ALTER TABLE `session` RENAME TO `template`;
ALTER TABLE `exercise_template` RENAME COLUMN `session_id` TO `template_id`;
/*
 SQLite does not support "Dropping foreign key" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/