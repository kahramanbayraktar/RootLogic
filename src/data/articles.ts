import rawArticles from './articles.json';

export interface Article {
  id: string;
  title: string;
  teaser: string;
  content: string;
  category: 'psychology' | 'philosophy' | 'gemini';
  date: string;
  readingTime: number;
  author: string;
  imageUrl?: string;
  layout?: 'wide' | 'narrow' | 'full';
}

export const categories = {
  psychology: { label: 'cat_psychology_analyses', slug: 'psychology' },
  philosophy: { label: 'cat_philosophical_inquiries', slug: 'philosophy' },
  gemini: { label: 'cat_gemini_gems', slug: 'gemini' },
} as const;

export const articles = rawArticles as Article[];


export function getArticleById(id: string): Article | undefined {
  return articles.find(article => article.id === id);
}

export function getArticlesByCategory(category: Article['category']): Article[] {
  return articles.filter(article => article.category === category);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}
