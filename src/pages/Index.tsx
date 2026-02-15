import ArticleCard from '@/components/ArticleCard';
import CategoryFilter from '@/components/CategoryFilter';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import ThoughtOfTheDay from '@/components/ThoughtOfTheDay';
import { useAuth } from '@/contexts/AuthContext';
import { fetchArticles } from '@/data/articles';
import { fetchCategories } from '@/data/categories';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

const Index = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const searchResult = searchParams.get('q') || '';

  const { data: articles = [], isLoading, isError } = useQuery({
    queryKey: ['articles'],
    queryFn: fetchArticles,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const filteredArticles = useMemo(() => {
    let result = articles;
    
    // Hidden Category Filter (for public users)
    if (!isAuthenticated) {
      const hiddenCategorySlugs = categories
        .filter(cat => cat.is_hidden)
        .map(cat => cat.slug);
      
      result = result.filter(article => !hiddenCategorySlugs.includes(article.category));
    }
    
    // Category Filter
    if (activeCategory !== 'all') {
      result = result.filter(article => article.category === activeCategory);
    }
    
    // Search Filter
    if (searchResult) {
      const query = searchResult.toLowerCase();
      result = result.filter(article => 
        article.title.toLowerCase().includes(query) || 
        article.content.toLowerCase().includes(query) ||
        article.subtitle?.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [activeCategory, articles, searchResult]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse font-serif text-2xl italic">{t('loading_articles')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <Navigation />
      <ThoughtOfTheDay />      
      
      <main className="max-w-6xl mx-auto px-6 pt-32 pb-16">
        {/* Category Filter */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-6"
        >
          <div className="flex flex-col gap-4">
            <CategoryFilter 
              activeCategory={activeCategory} 
              onCategoryChange={setActiveCategory} 
            />
            
            {searchResult && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-4 py-2 border-y border-border/30 bg-muted/5"
              >
                <p className="text-sm font-ui uppercase tracking-[0.2em] text-muted-foreground">
                  {t('searching_for')}: <span className="text-foreground font-bold italic">"{searchResult}"</span>
                </p>
                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.delete('q');
                    setSearchParams(params);
                  }}
                  className="p-1 hover:bg-muted rounded-full transition-colors"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Articles Masonry Grid */}
        <section>
          {filteredArticles.length > 0 ? (
            <div className="masonry-grid">
              {filteredArticles.map((article, index) => (
                <ArticleCard 
                  key={article.id} 
                  article={article} 
                  index={index} 
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-muted-foreground font-serif text-xl italic">
                {isError ? t('error_loading_articles') : t('no_articles_found')}
              </p>
            </motion.div>
          )}
        </section>


      </main>

      <Footer />
    </div>
  );
};

export default Index;
