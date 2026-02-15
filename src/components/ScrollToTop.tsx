import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-[90] flex flex-col items-center gap-2 group"
          aria-label="Scroll to top"
        >
          <div className="flex flex-col items-center">
            <div className="w-px h-12 bg-primary/30 group-hover:h-16 transition-all duration-500 origin-bottom" />
            <div className="w-10 h-10 rounded-full border border-primary/20 bg-background/80 backdrop-blur-md flex items-center justify-center text-primary shadow-lg shadow-primary/5 group-hover:border-primary/50 transition-colors">
              <ArrowUp size={18} strokeWidth={1.5} />
            </div>
          </div>
          <span className="text-[10px] font-ui uppercase tracking-[0.3em] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Top
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
