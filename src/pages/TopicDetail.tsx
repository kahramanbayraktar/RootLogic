import ArticleCard from '@/components/ArticleCard';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import { fetchArticles } from '@/data/articles';
import { fetchTopics } from '@/data/topics';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useParams } from 'react-router-dom';

const TopicDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();

  const { data: topics = [], isLoading: isLoadingTopics } = useQuery({
    queryKey: ['topics'],
    queryFn: fetchTopics,
  });

  const { data: articles = [], isLoading: isLoadingArticles } = useQuery({
    queryKey: ['articles'],
    queryFn: fetchArticles,
  });

  if (isLoadingTopics || isLoadingArticles) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse font-serif text-2xl italic">{t('loading')}</div>
      </div>
    );
  }

  const topic = topics.find(t => t.slug === slug);

  if (!topic) {
    return <Navigate to="/" replace />;
  }

  // Filter articles for this topic
  const topicArticles = articles.filter(a => (a.topic === topic.slug || a.topic === topic.id) && a.category !== 'software');

  // Localize Topic Title and Description
  const topicTitleKey = `topic_${topic.slug}_title`;
  const topicDescKey = `topic_${topic.slug}_desc`;
  const translatedTitle = t(topicTitleKey) !== topicTitleKey ? t(topicTitleKey) : topic.title;
  const translatedDesc = t(topicDescKey) !== topicDescKey ? t(topicDescKey) : topic.description;
  const topicLabel = t(`topic_${topic.slug}_label`) !== `topic_${topic.slug}_label` ? t(`topic_${topic.slug}_label`) : topic.slug;

  const headerColorMap: Record<string, string> = {
    rose: 'border-l-rose-500 text-rose-500',
    emerald: 'border-l-emerald-500 text-emerald-500',
    blue: 'border-l-blue-500 text-blue-500',
    slate: 'border-l-slate-500 text-slate-500',
  };
  const headerColors = headerColorMap[topic.theme_color || 'slate'];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-12"
          >
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 ui-label"
            >
              <ArrowLeft size={16} />
              {t('back_to_home')}
            </Link>
          </motion.div>

          {/* Topic Header */}
          <section className="mb-24">
             <div className={`flex items-center gap-8 mb-12 border-l-4 pl-8 py-2 ${headerColors.split(' ')[0]}`}>
               <div>
                   <div className={`text-[10px] font-bold tracking-[0.3em] mb-4 uppercase flex items-center gap-3 ${headerColors.split(' ')[1]}`}>
                     <span className="w-12 h-[1px] bg-current"></span>
                     {t('dossier_series')} // {topicLabel}
                   </div>
                   <h1 className="font-serif text-6xl md:text-8xl text-zinc-900 dark:text-zinc-100 mb-8 leading-[0.85] tracking-tighter uppercase">
                     {translatedTitle}
                   </h1>
                   <p className="text-2xl text-zinc-500 dark:text-zinc-400 font-serif italic max-w-3xl leading-relaxed">
                     {translatedDesc}
                   </p>
               </div>
             </div>
          </section>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topicArticles.length > 0 ? (
              topicArticles.map((article, index) => (
                <ArticleCard 
                  key={article.id} 
                  article={article} 
                  index={index} 
                  variant="boxed"
                  themeColor={topic.theme_color || 'slate'}
                />
              ))
            ) : (
              <div className="col-span-full py-24 text-center border border-dashed border-border/50">
                 <p className="font-serif italic text-zinc-400 text-xl">
                   {t('no_articles_in_topic')}
                 </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TopicDetail;
