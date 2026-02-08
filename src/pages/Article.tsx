import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import ReadingProgress from '@/components/ReadingProgress';
import { categories, fetchArticleById, formatDate } from '@/data/articles';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';

import ReactMarkdown from 'react-markdown';

const Article = () => {
  const { id } = useParams<{ id: string }>();

  const { data: article, isLoading, isError } = useQuery({
    queryKey: ['article', id],
    queryFn: () => (id ? fetchArticleById(id) : Promise.resolve(null)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse font-serif text-2xl italic">Opening the manuscript...</div>
      </div>
    );
  }

  if (isError || !article) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen">
      <ReadingProgress />
      <Navigation />
      
      <main className="pt-32 pb-16">
        {/* Back Link */}
        <div className="max-w-4xl mx-auto px-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              <ArrowLeft size={16} />
              Back to Library
            </Link>
          </motion.div>
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
            <span className="text-xs tracking-widest uppercase text-primary mb-4 block">
              {categories[article.category as keyof typeof categories]?.label || 'Uncategorized'}
            </span>
            
            {/* Title */}
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight mb-6">
              {article.title}
            </h1>
            
            {/* Meta */}
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <time dateTime={article.date}>
                {formatDate(article.date)}
              </time>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>{article.reading_time} min read</span>
            </div>
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

        {/* Author */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="reading-container mt-16 pt-8 border-t border-border"
        >
          <p className="text-sm text-muted-foreground text-center">
            Written by <span className="text-foreground">{article.author}</span>
          </p>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Article;
