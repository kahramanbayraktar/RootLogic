import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const ReadingProgress = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      // Show progress bar after scrolling past the hero section
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      className="progress-bar"
      style={{ 
        scaleX,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
    />
  );
};

export default ReadingProgress;
