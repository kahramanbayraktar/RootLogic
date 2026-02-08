import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-32 pb-16">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="reading-container"
        >
          {/* Header */}
          <header className="text-center mb-16">
            <h1 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
              About
            </h1>
            <div className="divider" />
          </header>

          {/* Content */}
          <div className="article-body">
            <p>
              The Root Logic is a space for contemplation—a digital sanctuary where psychology meets philosophy in the pursuit of deeper understanding.
            </p>

            <h2>Our Philosophy</h2>
            
            <p>
              In an age of infinite distraction, we believe in the power of slow thinking. Each essay here is crafted not to capture attention, but to reward it. We explore the fundamental questions of human existence: Why do we think the way we think? What does it mean to live well? How do we navigate the tension between who we are and who we might become?
            </p>

            <blockquote>
              "The unexamined life is not worth living." — Socrates
            </blockquote>

            <p>
              We draw from the wellsprings of psychological research and philosophical tradition, but our goal is not academic. It is practical wisdom—insights that can be lived, not merely contemplated.
            </p>

            <h2>The Three Pillars</h2>

            <p>
              Our content is organized around three complementary perspectives:
            </p>

            <p>
              <strong>Psychology Analyses</strong> ground our explorations in the science of mind. We examine the research on human behavior, cognition, and emotion, always asking: what does this tell us about how to live?
            </p>

            <p>
              <strong>Philosophical Inquiries</strong> lift our gaze to the enduring questions. Drawing from traditions both Western and Eastern, we seek wisdom that transcends the particular concerns of any single era.
            </p>

            <p>
              <strong>Health Insights</strong> are practical guides to well-being, grounded in scientific research and personal experience.
            </p>

            <h2>An Invitation</h2>

            <p>
              This is not a place for quick takes or easy answers. If you're looking for content to consume in the cracks of a busy day, there are better destinations. But if you seek a space for genuine reflection—if you believe, as we do, that the quality of our thinking shapes the quality of our lives—then you're welcome here.
            </p>

            <p>
              Take your time. Read slowly. Let the ideas settle. The Root Logic is here whenever you need it.
            </p>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
