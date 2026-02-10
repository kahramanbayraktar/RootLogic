import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <svg 
      viewBox="0 0 100 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={cn("h-auto w-auto", className)}
    >
      {/* Abstract Chaos (Left) - A series of overlapping, organic curves */}
      <motion.path
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.4 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        d="M5 20C5 20 8 10 15 20C22 30 25 10 30 20C35 30 38 15 42 20"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <motion.path
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{ duration: 1.2, delay: 0.2, ease: "easeInOut" }}
        d="M8 15C8 15 12 25 18 15C24 5 28 25 35 15C42 5 45 20 48 15"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      
      {/* The Filter / Lens / Pivot (Center) - A sharp vertical element */}
      <motion.ellipse 
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        cx="50" 
        cy="20" 
        rx="2.5" 
        ry="15" 
        fill="currentColor"
        className="text-primary"
      />
      <motion.ellipse 
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 0.3 }}
        transition={{ duration: 1, delay: 0.6 }}
        cx="50" 
        cy="20" 
        rx="4.5" 
        ry="18" 
        stroke="currentColor"
        strokeWidth="0.5"
        className="text-primary"
      />

      {/* Logic / Order (Right) - radiating straight geometric lines */}
      <motion.path 
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        d="M58 20H95" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
      <motion.path 
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.7 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        d="M58 14L90 10" 
        stroke="currentColor" 
        strokeWidth="1.2" 
        strokeLinecap="round" 
      />
      <motion.path 
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.7 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        d="M58 26L90 30" 
        stroke="currentColor" 
        strokeWidth="1.2" 
        strokeLinecap="round" 
      />
      <motion.path 
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.4 }}
        transition={{ duration: 0.6, delay: 1.3 }}
        d="M58 8L85 4" 
        stroke="currentColor" 
        strokeWidth="0.8" 
        strokeLinecap="round" 
      />
      <motion.path 
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.4 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        d="M58 32L85 36" 
        stroke="currentColor" 
        strokeWidth="0.8" 
        strokeLinecap="round" 
      />
    </svg>
  );
};

export default Logo;
