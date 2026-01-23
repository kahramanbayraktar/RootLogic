import { motion } from 'framer-motion';

const thoughts = [
  {
    quote: "The unexamined life is not worth living.",
    author: "Socrates"
  },
  {
    quote: "Man is condemned to be free.",
    author: "Jean-Paul Sartre"
  },
  {
    quote: "He who has a why can bear almost any how.",
    author: "Friedrich Nietzsche"
  },
  {
    quote: "The cave you fear to enter holds the treasure you seek.",
    author: "Joseph Campbell"
  },
  {
    quote: "Between stimulus and response there is a space.",
    author: "Viktor Frankl"
  }
];

const ThoughtOfTheDay = () => {
  // Get a thought based on the day of year for consistency
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const thought = thoughts[dayOfYear % thoughts.length];

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="floating-widget"
    >
      <div className="p-6 border border-border bg-card/50 backdrop-blur-sm">
        <span className="block text-[10px] font-semibold tracking-[0.25em] uppercase text-muted-foreground mb-4">
          Thought of the Day
        </span>
        <blockquote className="font-serif text-lg leading-snug tracking-tight text-foreground mb-3 italic">
          "{thought.quote}"
        </blockquote>
        <cite className="block text-xs text-muted-foreground not-italic">
          — {thought.author}
        </cite>
      </div>
    </motion.aside>
  );
};

export default ThoughtOfTheDay;
