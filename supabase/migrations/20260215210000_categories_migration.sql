-- Categories tablosunu oluştur
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Politikaları
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Herkes kategorileri görebilir
CREATE POLICY "Public categories are viewable by everyone." ON categories FOR SELECT USING (true);

-- Sadece yetkili kullanıcılar ekleyebilir (Geliştirme için herkese açık yapıyoruz, auth ile kısıtlanmalı normalde)
CREATE POLICY "Anyone can insert categories." ON categories FOR INSERT WITH CHECK (true);

-- Güncelleme
CREATE POLICY "Anyone can update categories." ON categories FOR UPDATE USING (true);

-- Silme
CREATE POLICY "Anyone can delete categories." ON categories FOR DELETE USING (true);

-- Mevcut kategorileri ekleyelim
INSERT INTO categories (slug, label) VALUES
  ('psychology', 'cat_psychology'),
  ('philosophy', 'cat_philosophy'),
  ('health', 'cat_health')
ON CONFLICT (slug) DO NOTHING;

-- Articles tablosundaki check constraint'i kaldır (eski constraint adı genellikle articles_category_check olur)
-- Supabase bazen otomatik isim verir, bu yüzden constraint adını kontrol etmek gerekebilir.
-- Ancak standart create table ile oluşturulduysa bu isimdedir.
ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_category_check;
