import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import Logo from './Logo';

const Navigation = () => {
  const { t } = useTranslation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/50">
      <nav className="max-w-6xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-4 group transition-all duration-300"
          >
            <Logo className="w-16 h-8 text-foreground group-hover:text-primary transition-colors duration-500" />
            <div className="logo-text text-2xl tracking-[-0.03em] flex flex-col md:flex-row md:items-baseline">
              <span className="font-semibold">Root</span>
              <span className="italic font-normal md:ml-1 opacity-70 group-hover:opacity-100 transition-opacity">Logic</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-muted-foreground hover:text-foreground transition-colors duration-300 p-2"
                aria-label="Open search"
              >
                <Search size={18} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <LanguageSwitcher />
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-muted-foreground hover:text-foreground transition-colors duration-300"
              aria-label="Open search"
            >
              <Search size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/98 z-50 flex items-start justify-center pt-32"
          >
            <div className="w-full max-w-xl px-6">
              <div className="flex items-center gap-4 border-b border-border pb-4">
                <Search size={20} className="text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                  aria-label="Close search"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground text-center">
                {searchQuery ? 'Press enter to search' : 'Type to search articles'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navigation;
