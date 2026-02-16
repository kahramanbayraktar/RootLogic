import ArticleCard from '@/components/ArticleCard';
import CategoryFilter from '@/components/CategoryFilter';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import ThoughtOfTheDay from '@/components/ThoughtOfTheDay';
import { useAuth } from '@/contexts/AuthContext';
import { fetchArticles } from '@/data/articles';
import { fetchCategories } from '@/data/categories';
import { fetchTopics } from '@/data/topics';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from "react-router-dom";

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

  const { data: topics = [] } = useQuery({
    queryKey: ['topics'],
    queryFn: fetchTopics,
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
    
    // Strict Software Category Filter (requested by user: only show in its own tab, even for admin)
    if (activeCategory !== 'software') {
      result = result.filter(article => article.category !== 'software');
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
  }, [activeCategory, articles, searchResult, isAuthenticated, categories]);

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


        {/* Featured Dossiers / Topics */}
        {!searchResult && activeCategory === 'all' && (
          <div className="space-y-24 mb-24">
            {topics.map((topic, index) => {
              // Priority 1: Articles explicitly assigned to this topic in DB (via slug or id)
              let topicArticles = articles.filter(a => 
                (a.topic === topic.slug || a.topic === topic.id) && 
                a.category !== 'software'
              );
              
              // Priority 2: If no articles assigned, use mock fallback for demo layout
              if (topicArticles.length === 0 && articles.length > 0) {
                 topicArticles = articles
                    .filter(a => a.category !== 'software')
                    .slice(index * 3, (index * 3) + 3);
              }

              // Header color mapping
              const headerColorMap: Record<string, string> = {
                rose: 'border-l-rose-500 text-rose-500',
                emerald: 'border-l-emerald-500 text-emerald-500',
                blue: 'border-l-blue-500 text-blue-500',
                slate: 'border-l-slate-500 text-slate-500',
              };
              const headerColors = headerColorMap[topic.theme_color || 'slate'];
              
              // Localize Topic Title and Description
              // These are stored in DB in one language, but we can provide translations
              // For now, if the title starts with "The ", we handle it (or use i18n keys)
              const topicTitleKey = `topic_${topic.slug}_title`;
              const topicDescKey = `topic_${topic.slug}_desc`;
              const translatedTitle = t(topicTitleKey) !== topicTitleKey ? t(topicTitleKey) : topic.title;
              const translatedDesc = t(topicDescKey) !== topicDescKey ? t(topicDescKey) : topic.description;

              return (
                 <motion.section
                   key={topic.id}
                   initial={{ opacity: 0, y: 40 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.8, delay: index * 0.2 }}
                   className="relative"
                 >
                   <div className="flex flex-col lg:flex-row gap-12 lg:items-center justify-between mb-16 relative">
                      <div className="max-w-2xl z-10">
                         <div className={`flex items-center gap-8 mb-12 border-l-4 pl-8 py-2 ${headerColors.split(' ')[0]}`}>
                               <Link to={`/topic/${topic.slug}`} className="group/topic">
                                 <div className={`text-[10px] font-bold tracking-[0.3em] mb-4 uppercase flex items-center gap-3 ${headerColors.split(' ')[1]}`}>
                                   <span className="w-12 h-[1px] bg-current"></span>
                                   {t('dossier_series')} // {t(`topic_${topic.slug}_label`) !== `topic_${topic.slug}_label` ? t(`topic_${topic.slug}_label`) : topic.slug}
                                 </div>
                                 <h2 className="font-serif text-6xl md:text-8xl text-zinc-900 dark:text-zinc-100 mb-8 leading-[0.85] tracking-tighter group-hover/topic:text-primary transition-colors">
                                   {translatedTitle}
                                 </h2>
                                 <p className="text-2xl text-zinc-500 dark:text-zinc-400 font-serif italic max-w-xl leading-relaxed group-hover/topic:opacity-80 transition-opacity">
                                   {translatedDesc}
                                 </p>
                               </Link>
                         </div>
                      </div>
                       {topic.cover_image && (
                         <motion.div 
                           initial={{ opacity: 0, scale: 0.95 }}
                           whileInView={{ opacity: 1, scale: 1 }}
                           viewport={{ once: true }}
                           transition={{ duration: 1.2, ease: "easeOut" }}
                           className="relative w-full lg:w-1/3 aspect-[4/5] overflow-hidden group shadow-2xl"
                         >
                           <Link to={`/topic/${topic.slug}`}>
                              <img 
                                src={topic.cover_image} 
                                alt="" 
                                className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-[2s] ease-out scale-105 group-hover:scale-100"
                              />
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                              <div className="absolute bottom-6 left-6 text-white flex items-center gap-3">
                                 <span className="w-8 h-[1px] bg-white text-white"></span>
                                 <span className="text-[10px] uppercase tracking-widest font-bold">Cover Visual</span>
                              </div>
                           </Link>
                         </motion.div>
                       )}

                      {!topic.cover_image && (
                        <div className="hidden lg:block">
                           <div className="text-[10px] font-bold tracking-widest text-zinc-300 dark:text-zinc-700 uppercase vertical-text origin-top-left rotate-90 translate-x-12 translate-y-4">
                              Curated Deep Dive // 2026
                           </div>
                        </div>
                      )}
                   </div>

                   {topicArticles.length > 0 ? (
                     <div className="grid grid-cols-12 gap-6 lg:gap-10">
                       {topicArticles.map((article, idx) => {
                         let spanClass = "col-span-12 md:col-span-4 lg:col-span-4";
                         const pattern = idx % 4;
                         if (pattern === 0) spanClass = "col-span-12 md:col-span-8 lg:col-span-8"; 
                         else if (pattern === 1) spanClass = "col-span-12 md:col-span-4 lg:col-span-4"; 
                         else if (pattern === 2) spanClass = "col-span-12 md:col-span-6 lg:col-span-6"; 
                         else if (pattern === 3) spanClass = "col-span-12 md:col-span-6 lg:col-span-6"; 
                         
                         return (
                           <div key={article.id} className={`${spanClass} flex`}>
                             <ArticleCard 
                               article={article} 
                               index={idx}
                               variant="boxed"
                               themeColor={topic.theme_color || 'slate'}
                             />
                           </div>
                         );
                       })}
                     </div>
                   ) : (
                     <div className="py-12 border border-dashed border-border rounded-lg flex flex-col items-center justify-center text-center p-6 bg-muted/5">
                        <div className="font-serif text-2xl italic text-muted-foreground mb-2">
                           Coming Soon
                        </div>
                        <p className="text-sm text-muted-foreground/60 max-w-md">
                           We are currently compiling research and articles for the <strong>{topic.title}</strong>. Check back soon for updates.
                        </p>
                     </div>
                   )}
                 </motion.section>
              );
            })}
            
            <div className="flex items-center justify-center py-8 opacity-50">
               <span className="w-16 h-[1px] bg-border block"></span>
               <span className="mx-4 font-ui text-xs uppercase tracking-widest text-muted-foreground">Latest Updates</span>
               <span className="w-16 h-[1px] bg-border block"></span>
            </div>
          </div>
        )}

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
