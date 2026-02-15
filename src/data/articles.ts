import { supabase } from '@/lib/supabase';

export interface Article {
  id: string;
  title: string;
  subtitle?: string | null;
  teaser: string;
  content: string;
  category: 'psychology' | 'philosophy' | 'health';
  date: string;
  reading_time: number;
  author: string;
  image_url?: string | null;
  layout?: 'wide' | 'narrow' | 'full';
}


export const categories = {
  psychology: { label: 'cat_psychology', slug: 'psychology' },
  philosophy: { label: 'cat_philosophy', slug: 'philosophy' },
  health: { label: 'cat_health', slug: 'health' },
} as const;

export async function fetchArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching articles:', error);
    return [];
  }

  return data as Article[];
}

export async function fetchArticleById(id: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching article:', error);
    return null;
  }

  return data as Article;
}

export async function createArticle(article: Article): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .insert([article])
    .select()
    .single();

  if (error) {
    console.error('Error creating article:', error);
    return null;
  }

  return data as Article;
}

export async function updateArticle(id: string, article: Partial<Article>): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .update(article)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating article:', error);
    return null;
  }

  return data as Article;
}

export async function deleteArticle(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting article:', error);
    return false;
  }

  return true;
}

export function formatDate(dateString: string, locale: string = 'en-US'): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

export async function uploadImageFromUrl(url: string, fileName: string): Promise<string | null> {
  try {
    let finalUrl = url;
    
    // Google images (lh3.googleusercontent.com, etc.) often block direct fetch due to CORS
    if (url.includes('googleusercontent.com') || url.includes('google.com')) {
      console.log('Detected Google-hosted image, using CORS proxy...');
      finalUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    }

    console.log('Fetching image from:', finalUrl);
    const response = await fetch(finalUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText} (${response.status})`);
    }
    
    const blob = await response.blob();
    const contentType = blob.type || 'image/webp';
    const fileExt = contentType.split('/')[1] || 'webp';
    const filePath = `${Date.now()}-${fileName}.${fileExt}`;

    console.log(`Uploading ${filePath} to Supabase storage...`);
    const { data, error: uploadError } = await supabase.storage
      .from('article-images')
      .upload(filePath, blob, {
        contentType: contentType,
        upsert: true
      });

    if (uploadError) {
      console.error('Supabase Storage Error:', uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('article-images')
      .getPublicUrl(filePath);

    console.log('Upload successful. Managed URL:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Image processing failed:', error);
    return null;
  }
}
