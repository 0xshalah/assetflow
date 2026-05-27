-- Add new columns to items table
ALTER TABLE items ADD COLUMN IF NOT EXISTS specification text NOT NULL DEFAULT '';
ALTER TABLE items ADD COLUMN IF NOT EXISTS unit text NOT NULL DEFAULT '';

-- Update category values from old to new
UPDATE items SET category = 'lemari-c01' WHERE category = 'elektrik';
UPDATE items SET category = 'lemari-c02' WHERE category = 'mekanik';
UPDATE items SET category = 'lemari-c03' WHERE category = 'facility';