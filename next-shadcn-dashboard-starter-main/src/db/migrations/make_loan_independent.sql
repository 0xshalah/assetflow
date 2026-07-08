-- Make loan independent of inventory
-- Add new columns for free-text item name, quantity, purpose, department
-- Make item_id nullable since loans no longer require inventory items

ALTER TABLE loans ADD COLUMN IF NOT EXISTS item_name text NOT NULL DEFAULT '';
ALTER TABLE loans ADD COLUMN IF NOT EXISTS quantity integer NOT NULL DEFAULT 1;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS purpose text NOT NULL DEFAULT '';
ALTER TABLE loans ADD COLUMN IF NOT EXISTS department text NOT NULL DEFAULT '';

-- Make item_id nullable (loans are now independent of inventory)
ALTER TABLE loans ALTER COLUMN item_id DROP NOT NULL;
