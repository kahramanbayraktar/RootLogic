import { categories } from '@/data/articles';
import i18n from '@/i18n';
import { toUpper } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

type CategoryKey = keyof typeof categories | 'all';

interface CategoryFilterProps {
  activeCategory: CategoryKey;
  onCategoryChange: (category: CategoryKey) => void;
}

const CategoryFilter = ({ activeCategory, onCategoryChange }: CategoryFilterProps) => {
  const {t} = useTranslation();
  
  const allCategories: { key: CategoryKey; label: string }[] = [
    { key: 'all', label: toUpper(t('all'), i18n.language) },
    ...Object.entries(categories).map(([key, value]) => ({
      key: key as CategoryKey,
      label: toUpper(t(value.label), i18n.language),
    })),
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden">
      {/* Editorial Fade Mask - Left */}
      <div className="absolute left-0 top-0 bottom-0 w-12 z-20 pointer-events-none bg-gradient-to-r from-background to-transparent" />
      
      {/* Editorial Fade Mask - Right */}
      <div className="absolute right-0 top-0 bottom-0 w-12 z-20 pointer-events-none bg-gradient-to-l from-background to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex flex-nowrap items-center gap-4 md:gap-8 overflow-x-auto no-scrollbar pt-1 pb-4 px-12 snap-x snap-mandatory justify-start md:justify-center"
      >
        {allCategories.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onCategoryChange(key)}
            className={`filter-button whitespace-nowrap transition-all duration-300 relative group snap-center py-2 ${
              activeCategory === key
                ? 'text-foreground font-medium scale-105'
                : 'text-muted-foreground/60 hover:text-foreground'
            }`}
          >
            <span className="text-xs md:text-sm font-ui tracking-[0.2em] relative z-10">
              {label}
            </span>
            
            {activeCategory === key && (
              <motion.div
                layoutId="active-category-indicator"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </motion.div>
    </div>
  );
};

export default CategoryFilter;
