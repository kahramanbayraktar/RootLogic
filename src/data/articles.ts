import { supabase } from '@/lib/supabase';

export interface Article {
  id: string;
  title: string;
  teaser: string;
  content: string;
  category: 'psychology' | 'philosophy' | 'health';
  date: string;
  reading_time: number;
  author: string;
  image_url?: string;
  layout?: 'wide' | 'narrow' | 'full';
}

export const categories = {
  psychology: { label: 'cat_psychology_analyses', slug: 'psychology' },
  philosophy: { label: 'cat_philosophical_inquiries', slug: 'philosophy' },
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

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}
