import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';

const Footer = () => {
  const { t } = useTranslation();
  const { isAuthenticated, logout } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="border-t border-border mt-12"
    >
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Logo */}
          <div className="flex flex-col items-center gap-3">
            <Logo className="w-20 h-10 text-foreground/80" />
            <h3 className="font-serif text-lg tracking-[0.1em] opacity-80">
              The Root Logic
            </h3>
          </div>
          
          {/* Tagline */}
          <p className="text-sm text-muted-foreground max-w-md">
            {t('footer_tagline')}
          </p>
          
          {/* Divider */}
          <div className="divider" />
          
          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            © {currentYear} The Root Logic.
          </p>

          {isAuthenticated && (
            <div className="mt-4">
              <button
                onClick={() => {
                  logout();
                  window.location.href = '/';
                }}
                className="text-[10px] uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
