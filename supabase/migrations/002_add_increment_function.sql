-- Function to increment model count for a tierlist category
CREATE OR REPLACE FUNCTION increment_tierlist_count(cat TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE tierlists
  SET model_count = model_count + 1
  WHERE category = cat;
END;
$$ LANGUAGE plpgsql;
