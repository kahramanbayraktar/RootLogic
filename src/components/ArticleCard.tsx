import { Article, formatDate, categories as staticCategories } from '@/data/articles';
import { fetchCategories } from '@/data/categories';
import { useQuery } from '@tanstack/react-query';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface ArticleCardProps {
  article: Article;
  index: number;
  variant?: 'default' | 'boxed';
  themeColor?: string;
}

const ArticleCard = ({ article, index, variant = 'default', themeColor = 'slate' }: ArticleCardProps) => {
  const { t, i18n } = useTranslation();
  
  const { data: categoriesData = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Helper to get category label
  const getCategoryLabel = (slug: string) => {
    // 1. Try dynamic categories
    const dynamicCat = categoriesData.find(c => c.slug === slug);
    if (dynamicCat) return t(dynamicCat.label);
    
    // 2. Try static categories (legacy)
    // @ts-ignore - indexing with string on specific keys
    const staticCat = staticCategories[slug];
    if (staticCat) return t(staticCat.label);
    
    // 3. Fallback to slug title-cased or straight
    return slug.charAt(0).toUpperCase() + slug.slice(1);
  };

  // Determine layout class based on article layout property
  const layoutClass = {
    wide: 'md:col-span-2',
    narrow: 'md:col-span-1',
    full: 'md:col-span-3 lg:col-span-3',
  }[article.layout || 'wide'];

  // Stagger delay based on index
  const staggerDelay = (index % 10) * 0.1;

  const editorialType = index % 4; // 0: TopImg, 1: SideImg, 2: TextOnly, 3: ColorBlock

  // Stable Image Pattern
  const currentImage = article.image_url || `https://images.unsplash.com/featured/?${article.category},${index}`;

  // Color Mapping for Tailwind (Safelist alternative)
  const colorMap: Record<string, { text: string, bg: string, border: string, dot: string }> = {
    rose: { text: 'text-rose-500', bg: 'bg-rose-600', border: 'border-t-rose-500', dot: 'bg-rose-500' },
    emerald: { text: 'text-emerald-500', bg: 'bg-emerald-600', border: 'border-t-emerald-500', dot: 'bg-emerald-500' },
    blue: { text: 'text-blue-500', bg: 'bg-blue-600', border: 'border-t-blue-500', dot: 'bg-blue-500' },
    slate: { text: 'text-slate-500', bg: 'bg-slate-600', border: 'border-t-slate-500', dot: 'bg-slate-500' },
  };

  const colors = colorMap[themeColor] || colorMap.slate;

  const isColorBlock = variant === 'boxed' && editorialType === 3;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ 
        duration: 0.8, 
        delay: staggerDelay,
        ease: [0.16, 1, 0.3, 1]
      }}
      className={`group relative flex flex-col h-full transition-all duration-700 overflow-hidden
        ${isColorBlock ? `${colors.bg} text-white border-0 shadow-lg` : 'bg-white dark:bg-zinc-950 border border-black/[0.08] dark:border-white/[0.08]'}
        shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.15)]
        ${variant === 'boxed' && !isColorBlock ? colors.border : ''}
      `}
    >
      <Link to={`/article/${article.id}`} className="flex flex-col h-full">
        {/* Image - Hidden in Text Only & Color Block for pure editorial feel */}
        {editorialType !== 2 && !isColorBlock && (
          <div className={`relative overflow-hidden ${editorialType === 1 ? 'aspect-[16/7]' : 'aspect-video'}`}>
            <motion.img
              src={currentImage}
              alt=""
              className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-60" />
            
            <div className="absolute top-4 right-4">
               <div className="px-2 py-1 text-[9px] font-bold tracking-[0.2em] uppercase text-white bg-black/60 backdrop-blur-sm border border-white/20">
                 {getCategoryLabel(article.category)}
               </div>
            </div>
          </div>
        )}

        {/* Content area */}
        <div className={`p-8 lg:p-10 flex flex-col flex-grow space-y-5 ${isColorBlock ? 'justify-center items-center text-center' : ''}`}>
           {/* Metadata accent */}
           <div className={`flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] uppercase ${isColorBlock ? 'text-white/70' : 'text-zinc-400'}`}>
              {!isColorBlock && <span className={`w-8 h-[1px] ${colors.dot}`}></span>}
              <span>{formatDate(article.date, i18n.language)}</span>
              <span>•</span>
              <span>{t('read_time', { count: article.reading_time })}</span>
           </div>

           <div className="space-y-3">
              <h2 className={`leading-[1.1] tracking-tight group-hover:opacity-80 transition-opacity
                ${editorialType === 0 ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'}
                ${isColorBlock ? 'text-white' : 'text-zinc-900 dark:text-zinc-100'}
              `}>
                {article.title}
              </h2>

              {article.subtitle && (
                <p className={`article-card-subtitle ${isColorBlock ? 'text-white/80' : ''}`}>
                  {article.subtitle}
                </p>
              )}
           </div>

           {(editorialType === 0 || editorialType === 2 || isColorBlock) && (
              <p className={`text-sm leading-relaxed line-clamp-4 ${isColorBlock ? 'text-white/90' : 'text-zinc-600 dark:text-zinc-400'}`}>
                {article.teaser}
              </p>
           )}

           <div className={`pt-6 mt-auto flex items-center justify-between border-t ${isColorBlock ? 'border-white/20 w-full' : 'border-black/[0.05] dark:border-white/[0.05]'}`}>
              <span className={`text-[10px] font-bold tracking-widest uppercase ${isColorBlock ? 'text-white' : 'text-primary'}`}>
                {t('read_story')}
              </span>
              <span className={`text-[11px] font-serif italic ${isColorBlock ? 'text-white/70' : 'text-zinc-400'}`}>
                {article.author}
              </span>
           </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default ArticleCard;
