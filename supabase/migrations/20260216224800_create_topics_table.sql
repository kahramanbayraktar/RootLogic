-- Create topics table
CREATE TABLE IF NOT EXISTS topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_image TEXT,
  theme_color TEXT DEFAULT 'slate',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public topics are viewable by everyone." ON topics FOR SELECT USING (true);
CREATE POLICY "Anyone can insert topics." ON topics FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update topics." ON topics FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete topics." ON topics FOR DELETE USING (true);

-- Insert initial topics to match current static data
INSERT INTO topics (slug, title, description, theme_color) VALUES
  ('cancer', 'The Cancer Dossier', 'A deep-dive into the biology of cancer, current therapeutic approaches, and the frontiers of preventive research.', 'rose'),
  ('longevity', 'Longevity & Aging', 'From biological clock resetting to nutritional interventions—understanding how to live longer and healthier.', 'emerald'),
  ('neuroscience', 'The Human Brain', 'Exploring the complexities of our most vital organ—from consciousness research to neuroplasticity.', 'blue')
ON CONFLICT (slug) DO NOTHING;
