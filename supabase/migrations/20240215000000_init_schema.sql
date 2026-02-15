-- Articles tablosunu oluştur
CREATE TABLE articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  teaser TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('psychology', 'philosophy', 'health')),
  date DATE NOT NULL,
  reading_time INTEGER NOT NULL,
  author TEXT NOT NULL,
  image_url TEXT,
  layout TEXT CHECK (layout IN ('wide', 'narrow', 'full')) DEFAULT 'wide',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) ayarları
-- Herkes okuyabilir
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON articles FOR SELECT USING (true);

-- Makale ekleme izni (Development için herkese açık)
CREATE POLICY "Anyone can insert articles." ON articles FOR INSERT WITH CHECK (true);

-- Makale güncelleme izni
CREATE POLICY "Anyone can update articles." ON articles FOR UPDATE USING (true);

-- Makale silme izni
CREATE POLICY "Anyone can delete articles." ON articles FOR DELETE USING (true);
