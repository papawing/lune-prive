-- AlterTable: Add new columns to casts table for enhanced profile system
ALTER TABLE "casts" ADD COLUMN IF NOT EXISTS "birthday" TIMESTAMP(3);
ALTER TABLE "casts" ADD COLUMN IF NOT EXISTS "bust_size" TEXT;
ALTER TABLE "casts" ADD COLUMN IF NOT EXISTS "height" INTEGER;
ALTER TABLE "casts" ADD COLUMN IF NOT EXISTS "weight" INTEGER;
ALTER TABLE "casts" ADD COLUMN IF NOT EXISTS "english_level" TEXT;

-- Convert bio from TEXT to JSONB for multilingual support
-- First, create a backup of existing bio data
DO $$
BEGIN
  -- Only alter if the column exists and is not already JSONB
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'casts'
    AND column_name = 'bio'
    AND data_type != 'jsonb'
  ) THEN
    -- Create temporary column to store converted data
    ALTER TABLE "casts" ADD COLUMN IF NOT EXISTS "bio_temp" JSONB;

    -- Convert existing string bio to JSON format
    UPDATE "casts"
    SET "bio_temp" = jsonb_build_object('en', "bio")
    WHERE "bio" IS NOT NULL AND "bio" != '';

    -- Drop old column and rename new one
    ALTER TABLE "casts" DROP COLUMN "bio";
    ALTER TABLE "casts" RENAME COLUMN "bio_temp" TO "bio";
  END IF;
END $$;

-- Add new JSONB columns for multilingual content
ALTER TABLE "casts" ADD COLUMN IF NOT EXISTS "personality" JSONB;
ALTER TABLE "casts" ADD COLUMN IF NOT EXISTS "appearance" JSONB;
ALTER TABLE "casts" ADD COLUMN IF NOT EXISTS "service_style" JSONB;
ALTER TABLE "casts" ADD COLUMN IF NOT EXISTS "preferred_type" JSONB;

-- Add new array columns for lifestyle preferences
ALTER TABLE "casts" ADD COLUMN IF NOT EXISTS "hobbies" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "casts" ADD COLUMN IF NOT EXISTS "holiday_style" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Update default values for existing rows
UPDATE "casts" SET "hobbies" = ARRAY[]::TEXT[] WHERE "hobbies" IS NULL;
UPDATE "casts" SET "holiday_style" = ARRAY[]::TEXT[] WHERE "holiday_style" IS NULL;
