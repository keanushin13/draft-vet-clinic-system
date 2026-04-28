-- Update existing VetSchedule rows that still use the old default end time of 17:00
-- to the new operating hours end time of 19:00 (7 PM).
UPDATE "VetSchedule"
SET "endTime" = '19:00'
WHERE "endTime" = '17:00';
