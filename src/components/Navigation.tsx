import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutGrid, Library, LogOut, Plus, Search, Tag, X } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import Logo from './Logo';

const Navigation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-background/90 backdrop-blur-md border-b border-border/50">
      <nav className="max-w-6xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-4 group transition-all duration-300"
          >
            <Logo className="w-16 h-8 text-foreground group-hover:text-primary transition-colors duration-500" />
            <div className="logo-text text-2xl tracking-[-0.03em] flex flex-row items-baseline gap-1.5">
              <span className="font-semibold">Root</span>
              <span className="italic font-normal opacity-70 group-hover:opacity-100 transition-opacity">Logic</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-muted-foreground hover:text-foreground transition-colors duration-300 p-2"
                aria-label="Open search"
              >
                <Search size={18} strokeWidth={1.5} />
              </button>

              {isAuthenticated && (
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="text-muted-foreground hover:text-foreground transition-colors duration-300 p-2">
                        <LayoutGrid size={18} strokeWidth={1.5} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end" 
                      sideOffset={12}
                      className="w-56 rounded-none font-ui uppercase tracking-widest text-[10px] bg-background/95 backdrop-blur-md border-border/50 p-1"
                    >
                      <DropdownMenuLabel className="opacity-50 px-3 py-2 font-bold tracking-[0.2em]">{t('management')}</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-border/30" />
                      <DropdownMenuItem 
                        onClick={() => navigate('/create')}
                        className="cursor-pointer px-3 py-2 flex items-center gap-3 focus:bg-primary focus:text-white transition-colors"
                      >
                        <Plus size={14} /> {t('create_article')}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => navigate('/categories')}
                        className="cursor-pointer px-3 py-2 flex items-center gap-3 focus:bg-primary focus:text-white transition-colors"
                      >
                        <Tag size={14} /> {t('categories')}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => navigate('/topics')}
                        className="cursor-pointer px-3 py-2 flex items-center gap-3 focus:bg-primary focus:text-white transition-colors"
                      >
                        <Library size={14} /> {t('dossiers')}
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator className="bg-border/30" />
                      <DropdownMenuItem 
                        onClick={() => {
                          logout();
                          navigate('/');
                        }}
                        className="cursor-pointer px-3 py-2 flex items-center gap-3 text-destructive focus:bg-destructive focus:text-white transition-colors"
                      >
                        <LogOut size={14} /> {t('logout')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <LanguageSwitcher />
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-muted-foreground hover:text-foreground transition-colors duration-300"
              aria-label="Open search"
            >
              <Search size={20} />
            </button>
            {isAuthenticated && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2">
                        <LayoutGrid size={20} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" sideOffset={12} className="w-56 rounded-none font-ui uppercase tracking-widest text-[10px] bg-background border-border/50">
                      <DropdownMenuLabel className="opacity-50 px-3 py-2 font-bold tracking-[0.2em]">{t('management')}</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-border/30" />
                      <DropdownMenuItem onClick={() => navigate('/create')} className="px-3 py-2 flex items-center gap-3">
                         <Plus size={14} /> {t('create_article')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/categories')} className="px-3 py-2 flex items-center gap-3">
                        <Tag size={14} /> {t('categories')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/topics')} className="px-3 py-2 flex items-center gap-3">
                        <Library size={14} /> {t('dossiers')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-border/30" />
                      <DropdownMenuItem 
                        onClick={() => {
                          logout();
                          navigate('/');
                        }}
                        className="px-3 py-2 flex items-center gap-3 text-destructive"
                      >
                        <LogOut size={14} /> {t('logout')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Search Modal - Portal to Body for absolute z-index priority */}
      {isSearchOpen && createPortal(
        <AnimatePresence mode="wait">
          <motion.div
            key="search-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background z-[1000] flex items-start justify-center pt-32"
          >
            <div className="w-full max-w-xl px-6">
              <form onSubmit={handleSearch} className="flex items-center gap-4 border-b border-border pb-4">
                <Search size={20} className="text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t('search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                  aria-label="Close search"
                >
                  <X size={20} />
                </button>
              </form>
              <p className="mt-6 text-sm text-muted-foreground text-center font-ui uppercase tracking-widest opacity-60">
                {searchQuery ? t('search_press_enter') : t('search_hint')}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
};

export default Navigation;
