import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import ReadingProgress from '@/components/ReadingProgress';
import SocialMediaGenerator from '@/components/SocialMediaGenerator';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from '@/contexts/AuthContext';
import { fetchArticleById, formatDate, categories as staticCategories } from '@/data/articles';
import { fetchCategories } from '@/data/categories';
import { toUpper } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Pencil, Share2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { Link, Navigate, useParams } from 'react-router-dom';

const Article = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const [isSocialDialogOpen, setIsSocialDialogOpen] = useState(false);

  const { data: categoriesData = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const { data: article, isLoading, isError } = useQuery({
    queryKey: ['article', id],
    queryFn: () => (id ? fetchArticleById(id) : Promise.resolve(null)),
    enabled: !!id,
  });

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse font-serif text-2xl italic">{t('opening_article')}</div>
      </div>
    );
  }

  if (isError || !article) {
    return <Navigate to="/" replace />;
  }

  // Check if category is hidden
  const categoryData = categoriesData.find(c => c.slug === article.category);
  if (categoryData?.is_hidden && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen">
      <ReadingProgress />
      <Navigation />
      
      <main className="pt-32 pb-8">
        {/* Back and Edit Links */}
        <div className="max-w-4xl mx-auto px-6 mb-12 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 ui-label"
            >
              <ArrowLeft size={16} />
              {t('back_to_articles')}
            </Link>
          </motion.div>

          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-4"
            >
              <Dialog open={isSocialDialogOpen} onOpenChange={setIsSocialDialogOpen}>
                <DialogTrigger asChild>
                  <button 
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 ui-label"
                    title="Generate Social Post"
                  >
                    <Share2 size={15} />
                    Social Post
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-fit bg-transparent border-none shadow-none p-0">
                  <SocialMediaGenerator article={article} onClose={() => setIsSocialDialogOpen(false)} />
                </DialogContent>
              </Dialog>

              <Link 
                to={`/edit/${id}`} 
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 ui-label"
              >
                <Pencil size={15} />
                {t('edit_article')}
              </Link>
            </motion.div>
          )}
        </div>

        {/* Article Header */}
        <header className="reading-container mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Category */}
            <span className="category-badge text-xs tracking-widest uppercase text-primary mb-4 block">
              {toUpper(getCategoryLabel(article.category), i18n.language)}
            </span>
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl leading-tight mb-4">
              {article.title}
            </h1>

            {/* Subtitle */}
            {article.subtitle && (
              <motion.p 
                className="article-subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.35 }}
              >
                {article.subtitle}
              </motion.p>
            )}
            
            {/* Meta */}
            <motion.div 
              className="meta-info flex items-center justify-center gap-4 text-sm text-muted-foreground mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <time dateTime={article.date}>
                {formatDate(article.date, i18n.language)}
              </time>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>{t('read_time', { count: article.reading_time })}</span>
            </motion.div>

            {/* Feature Image */}
            {article.image_url && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
                className="w-full aspect-video rounded-lg overflow-hidden mb-12 border border-border/50"
              >
                <img 
                  src={article.image_url} 
                  alt={article.title} 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}
          </motion.div>
        </header>

        {/* Divider */}
        <div className="divider" />

        {/* Article Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="reading-container"
        >
          <div className="article-body">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>
        </motion.article>


      </main>

      <Footer />
    </div>
  );
};

export default Article;
