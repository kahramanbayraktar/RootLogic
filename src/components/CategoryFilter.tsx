import { motion } from 'framer-motion';
import { categories } from '@/data/articles';

type CategoryKey = keyof typeof categories | 'all';

interface CategoryFilterProps {
  activeCategory: CategoryKey;
  onCategoryChange: (category: CategoryKey) => void;
}

const CategoryFilter = ({ activeCategory, onCategoryChange }: CategoryFilterProps) => {
  const allCategories: { key: CategoryKey; label: string }[] = [
    { key: 'all', label: 'All' },
    ...Object.entries(categories).map(([key, value]) => ({
      key: key as CategoryKey,
      label: value.label,
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
          className={`px-4 py-2 text-sm tracking-wide transition-all duration-300 rounded-sm ${
            activeCategory === key
              ? 'bg-foreground text-background'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
          }`}
        >
          {label}
        </button>
      ))}
    </motion.div>
  );
};

export default CategoryFilter;
