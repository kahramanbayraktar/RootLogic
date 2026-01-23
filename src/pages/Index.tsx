import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import ArticleCard from '@/components/ArticleCard';
import CategoryFilter from '@/components/CategoryFilter';
import Footer from '@/components/Footer';
import ThoughtOfTheDay from '@/components/ThoughtOfTheDay';
import { articles, categories } from '@/data/articles';

type CategoryKey = keyof typeof categories | 'all';

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');

  const filteredArticles = useMemo(() => {
    if (activeCategory === 'all') return articles;
    return articles.filter(article => article.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen relative">
      <Navigation />
      <ThoughtOfTheDay />
      
      <main className="max-w-6xl mx-auto px-6 pt-32 pb-16">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="mb-20"
        >
          {/* Asymmetric hero layout */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-7">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="block text-[10px] font-semibold tracking-[0.3em] uppercase text-muted-foreground mb-6"
              >
                Est. MMXXIV
              </motion.span>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-[-0.04em] mb-8"
              >
                The Root
                <br />
                <span className="italic font-normal">Logic</span>
              </motion.h1>
            </div>
            
            <div className="col-span-12 lg:col-span-5 lg:flex lg:flex-col lg:justify-end lg:pb-4">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="text-lg text-muted-foreground leading-relaxed max-w-md"
              >
                A curated archive exploring the depths of mind and meaning through the lenses of psychology and philosophy.
              </motion.p>
            </div>
          </div>
          
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="w-full h-px bg-border mt-12 origin-left"
          />
        </motion.section>

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
                No articles found in this category.
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
