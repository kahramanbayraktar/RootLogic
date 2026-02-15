-- Categories tablosuna a is_hidden sütunu ekle
ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE;
