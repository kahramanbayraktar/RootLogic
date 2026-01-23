import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="border-t border-border mt-24"
    >
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Logo */}
          <h3 className="font-serif text-lg tracking-tight">
            The Root Logic
          </h3>
          
          {/* Tagline */}
          <p className="text-sm text-muted-foreground max-w-md">
            Exploring the depths of mind and meaning through psychology and philosophy.
          </p>
          
          {/* Divider */}
          <div className="divider" />
          
          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            © {currentYear} The Root Logic. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
