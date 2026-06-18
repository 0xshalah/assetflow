-- Add minimum_stock column to items table
ALTER TABLE items ADD COLUMN IF NOT EXISTS minimum_stock integer NOT NULL DEFAULT 0;
