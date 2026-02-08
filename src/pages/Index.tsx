import ArticleCard from '@/components/ArticleCard';
import CategoryFilter from '@/components/CategoryFilter';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import ThoughtOfTheDay from '@/components/ThoughtOfTheDay';
import { categories, fetchArticles } from '@/data/articles';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';

type CategoryKey = keyof typeof categories | 'all';

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');

  const { data: articles = [], isLoading, isError } = useQuery({
    queryKey: ['articles'],
    queryFn: fetchArticles,
  });

  const filteredArticles = useMemo(() => {
    if (activeCategory === 'all') return articles;
    return articles.filter(article => article.category === activeCategory);
  }, [activeCategory, articles]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse font-serif text-2xl italic">Loading library...</div>
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
          className="mb-12"
        >
          <CategoryFilter 
            activeCategory={activeCategory} 
            onCategoryChange={setActiveCategory} 
          />
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
                {isError ? 'Error loading articles. Please check your connection.' : 'No articles found in this category.'}
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
