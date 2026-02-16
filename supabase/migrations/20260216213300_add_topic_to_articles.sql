-- Add topic and subtitle columns to articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS topic TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS subtitle TEXT;
