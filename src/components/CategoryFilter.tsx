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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex flex-wrap gap-3 justify-center"
    >
      {allCategories.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onCategoryChange(key)}
          className={`filter-button px-6 py-2 transition-all duration-300 relative group ${
            activeCategory === key
              ? 'text-foreground font-medium'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <span className="relative z-10 transition-colors duration-300">
            {label}
          </span>
          {activeCategory === key && (
            <motion.div
              layoutId="active-category"
              className="absolute inset-x-0 bottom-0 h-[2px] bg-primary mx-4"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-primary/10 mx-4 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
        </button>
      ))}
    </motion.div>
  );
};

export default CategoryFilter;
