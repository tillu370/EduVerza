-- Migration to add sem column to existing resources table
-- Run this if you already created the resources table without sem column

-- Add sem column
ALTER TABLE resources 
ADD COLUMN IF NOT EXISTS sem INTEGER CHECK (sem >= 1 AND sem <= 8);

-- Update existing records with default semester values based on year
-- Year 1 -> Sem 1 or 2, Year 2 -> Sem 3 or 4, Year 3 -> Sem 5 or 6, Year 4 -> Sem 7 or 8
UPDATE resources 
SET sem = CASE 
  WHEN year = 1 THEN 1
  WHEN year = 2 THEN 3
  WHEN year = 3 THEN 5
  WHEN year = 4 THEN 7
  ELSE 1
END
WHERE sem IS NULL;

-- Make sem NOT NULL after updating existing records
ALTER TABLE resources 
ALTER COLUMN sem SET NOT NULL;

-- Create index for sem column
CREATE INDEX IF NOT EXISTS idx_resources_sem ON resources(sem);

