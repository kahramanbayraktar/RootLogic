import { Article, categories, formatDate } from '@/data/articles';
import { toUpper } from '@/lib/utils';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface ArticleCardProps {
  article: Article;
  index: number;
}

const ArticleCard = ({ article, index }: ArticleCardProps) => {
  const { t, i18n } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Determine layout class based on article layout property
  const layoutClass = {
    wide: 'masonry-item-wide',
    narrow: 'masonry-item-narrow',
    full: 'masonry-item-full',
  }[article.layout || 'wide'];

  // Stagger delay based on index
  const staggerDelay = index * 0.15;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ 
        duration: 0.7, 
        delay: staggerDelay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className={`group ${layoutClass}`}
    >
      <Link 
        to={`/article/${article.id}`} 
        className="block h-full border border-border bg-card/30 hover:bg-card/60 transition-all duration-500 overflow-hidden card-hover"
      >
        {/* Image */}
        {article.image_url && (
          <div className="relative overflow-hidden aspect-[16/10]">
            <motion.img
              src={article.image_url}
              alt=""
              className="w-full h-full object-cover image-sepia"
              initial={{ scale: 1.1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          </div>
        )}

        <div className="p-6 lg:p-8">
          {/* Category */}
          <motion.span 
            className="category-pill mb-4 inline-block"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: staggerDelay + 0.2 }}
          >
            {toUpper(t(categories[article.category]?.label || 'Uncategorized'), i18n.language)}
          </motion.span>
          
          {/* Title with reveal animation */}
          <motion.h2 
            className="font-serif text-2xl md:text-3xl lg:text-4xl leading-[1.1] tracking-tight mb-2 group-hover:text-primary transition-colors duration-500"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: staggerDelay + 0.3 }}
          >
            {article.title}
          </motion.h2>

          {/* Subtitle */}
          {article.subtitle && (
            <motion.p 
              className="article-subtitle"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: staggerDelay + 0.35 }}
            >
              {article.subtitle}
            </motion.p>
          )}
          
          {/* Teaser with reveal */}
          <motion.p 
            className="text-muted-foreground leading-relaxed mb-6 line-clamp-3"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: staggerDelay + 0.4 }}
          >
            {article.teaser}
          </motion.p>
          
          {/* Meta */}
          <motion.div 
            className="meta-info flex items-center gap-4 text-xs tracking-wide text-muted-foreground uppercase"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: staggerDelay + 0.5 }}
          >
            <time dateTime={article.date}>
              {formatDate(article.date, i18n.language)}
            </time>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
            <span>{t('read_time', { count: article.reading_time })}</span>
          </motion.div>
        </div>
      </Link>
    </motion.article>
  );
};

export default ArticleCard;
