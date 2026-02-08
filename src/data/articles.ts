export interface Article {
  id: string;
  title: string;
  teaser: string;
  content: string;
  category: 'psychology' | 'philosophy' | 'gemini';
  date: string;
  readingTime: number;
  author: string;
  imageUrl?: string;
  layout?: 'wide' | 'narrow' | 'full';
}

export const categories = {
  psychology: { label: 'cat_psychology_analyses', slug: 'psychology' },
  philosophy: { label: 'cat_philosophical_inquiries', slug: 'philosophy' },
  gemini: { label: 'cat_gemini_gems', slug: 'gemini' },
} as const;

export const articles: Article[] = [
  {
    id: 'the-paradox-of-choice',
    title: 'The Paradox of Choice',
    teaser: 'Why having more options often leads to less satisfaction, and what ancient wisdom teaches us about decision-making.',
    content: `
      <p>In the modern age, we are constantly bombarded with choices. From the coffee we drink in the morning to the paths we take in our careers, the sheer volume of options available to us can be overwhelming. This phenomenon, often referred to as the "paradox of choice," suggests that while some choice is undoubtedly better than none, more is not always better than less.</p>
      
      <h2>The Weight of Infinite Possibility</h2>
      
      <p>Barry Schwartz, in his seminal work on the subject, argues that the abundance of choice actually diminishes our well-being. When faced with too many options, we experience decision fatigue, anxiety about making the "wrong" choice, and a nagging sense that we could have done better.</p>
      
      <blockquote>"The secret of happiness is low expectations." — Barry Schwartz</blockquote>
      
      <p>This insight echoes through centuries of philosophical thought. The Stoics understood that our suffering often stems not from what happens to us, but from our judgments about what could have been. Marcus Aurelius wrote extensively about the freedom that comes from accepting what is, rather than lamenting what might be.</p>
      
      <h2>Finding Freedom in Constraint</h2>
      
      <p>Paradoxically, constraints can be liberating. When we limit our options intentionally, we free cognitive resources for deeper engagement with what we choose. The Japanese concept of "wabi-sabi" celebrates the beauty of imperfection and the acceptance of transience—a direct antidote to the modern obsession with optimization.</p>
      
      <p>Consider the artist who works within strict formal constraints, or the writer who embraces a specific form. These limitations don't diminish creativity; they channel it, providing a framework within which genuine innovation can flourish.</p>
      
      <h3>Practical Applications</h3>
      
      <p>How might we apply these insights to our daily lives? Here are some considerations:</p>
      
      <ul>
        <li>Practice satisficing rather than maximizing—seek "good enough" rather than "the best"</li>
        <li>Establish personal rules that eliminate certain categories of choice</li>
        <li>Cultivate gratitude for what you have chosen, rather than dwelling on alternatives</li>
        <li>Recognize that reversible decisions require less deliberation than irreversible ones</li>
      </ul>
      
      <p>The paradox of choice reveals something profound about human nature: we are not purely rational beings seeking to maximize utility. We are meaning-seeking creatures who thrive within structures that give shape to our lives.</p>
    `,
    category: 'psychology',
    date: '2024-01-15',
    readingTime: 8,
    author: 'The Root Logic',
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&q=80',
    layout: 'wide',
  },
  {
    id: 'on-solitude',
    title: 'On Solitude',
    teaser: 'Exploring the philosophical dimensions of being alone and why modern life makes genuine solitude both more difficult and more necessary.',
    content: `
      <p>There is a profound difference between loneliness and solitude. Loneliness is a state of lack—the painful awareness of missing connection. Solitude, by contrast, is a state of presence—the deliberate choice to be with oneself.</p>
      
      <h2>The Philosophy of Aloneness</h2>
      
      <p>Throughout history, philosophers have recognized solitude as essential to the examined life. Montaigne retreated to his tower. Thoreau went to Walden. Nietzsche walked the mountain paths of Sils-Maria. These were not escapes from life but deeper engagements with it.</p>
      
      <blockquote>"All of humanity's problems stem from man's inability to sit quietly in a room alone." — Blaise Pascal</blockquote>
      
      <p>Pascal's observation, made in the 17th century, feels even more urgent today. We have constructed an entire technological apparatus designed to ensure we never have to be alone with our thoughts. Every moment of potential solitude is filled with scrolling, swiping, streaming.</p>
      
      <h2>The Neuroscience of Quiet</h2>
      
      <p>Recent research in neuroscience supports what philosophers intuited: periods of solitude are essential for cognitive health. The default mode network—the brain's self-referential system—requires disengagement from external stimuli to function optimally. This network is associated with self-reflection, creative thinking, and the consolidation of memory.</p>
      
      <p>When we constantly seek external input, we deprive ourselves of the internal processing time necessary for genuine insight. The mind needs fallow periods, just as fields need to rest between harvests.</p>
      
      <h3>Reclaiming Solitude</h3>
      
      <p>To reclaim solitude in the modern world requires intentionality. It means creating spaces—physical and temporal—where we are unreachable. It means resisting the cultural pressure that equates being alone with being unproductive or antisocial.</p>
      
      <p>Solitude is not selfishness. It is the necessary condition for the self-knowledge that makes genuine connection with others possible. We cannot offer our authentic presence to another if we have never been present to ourselves.</p>
    `,
    category: 'philosophy',
    date: '2024-01-08',
    readingTime: 6,
    author: 'The Root Logic',
    imageUrl: 'https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?w=800&q=80',
    layout: 'narrow',
  },
  {
    id: 'the-duality-of-gemini',
    title: 'The Duality Within',
    teaser: 'Understanding the psychological significance of our internal contradictions and why embracing them leads to wholeness.',
    content: `
      <p>We are all, to varying degrees, houses divided against themselves. We want connection and independence. We seek stability and adventure. We value honesty yet find ourselves crafting careful self-presentations. This internal duality is not a flaw to be corrected but a feature of conscious existence.</p>
      
      <h2>The Symbol of the Twins</h2>
      
      <p>The astrological symbol of Gemini—the twins—captures something psychologically profound. It represents the multiplicity of self that each of us contains. We are not singular, unified beings but complex assemblages of competing desires, values, and identities.</p>
      
      <blockquote>"Do I contradict myself? Very well then I contradict myself. (I am large, I contain multitudes.)" — Walt Whitman</blockquote>
      
      <p>Carl Jung spoke of this in terms of the shadow—those aspects of ourselves we deny or suppress. The shadow isn't evil; it's simply the sum of what we haven't integrated. Wholeness comes not from eliminating our contradictions but from holding them in creative tension.</p>
      
      <h2>Dialectical Thinking</h2>
      
      <p>The ancient Greeks understood that truth often emerges from the dialogue between opposing positions. Heraclitus saw the universe itself as constituted by the tension of opposites: "The road up and the road down are one and the same."</p>
      
      <p>This dialectical approach has profound implications for how we understand ourselves. Rather than seeking to eliminate our contradictions, we can learn to see them as generative—the friction that produces insight and growth.</p>
      
      <h3>Living with Ambivalence</h3>
      
      <p>Psychological maturity involves the capacity to tolerate ambivalence—to hold competing truths without needing immediate resolution. This is uncomfortable for a culture that prizes clarity and decisiveness. Yet the most profound truths often come wrapped in paradox.</p>
      
      <p>The duality within us is not a problem to be solved but a mystery to be lived. When we stop fighting our internal contradictions and start listening to what they're trying to tell us, we open the door to genuine self-understanding.</p>
    `,
    category: 'gemini',
    date: '2024-01-01',
    readingTime: 7,
    author: 'The Root Logic',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    layout: 'narrow',
  },
  {
    id: 'attachment-styles',
    title: 'The Architecture of Attachment',
    teaser: 'How our earliest relationships shape the invisible structures through which we experience love, fear, and connection.',
    content: `
      <p>Before we have words, we have relationships. The bond between infant and caregiver lays down neural pathways that will shape how we experience intimacy for the rest of our lives. This is the foundation of attachment theory—one of the most robust frameworks in developmental psychology.</p>
      
      <h2>Four Patterns of Connection</h2>
      
      <p>John Bowlby and Mary Ainsworth identified distinct patterns in how children relate to their caregivers, patterns that persist into adulthood. Secure attachment develops when caregivers are consistently responsive. The child learns that the world is safe and that their needs will be met.</p>
      
      <blockquote>"What cannot be communicated to the mother cannot be communicated to the self." — John Bowlby</blockquote>
      
      <p>Insecure attachment styles—anxious, avoidant, and disorganized—emerge when this early responsiveness is inconsistent, absent, or frightening. These are not character flaws but adaptations. They were the best strategies available to us in our earliest environments.</p>
      
      <h2>The Possibility of Change</h2>
      
      <p>The remarkable news from contemporary neuroscience is that these patterns, while deeply ingrained, are not immutable. The brain retains plasticity throughout life. Through what's called "earned secure attachment," individuals can develop new relational capacities even if their early experiences were difficult.</p>
      
      <p>This typically requires experiences of being truly seen and understood—whether in therapy, friendship, or romantic relationship. When someone responds to us in ways our early caregivers couldn't, new neural pathways form. We literally rewire our expectations of connection.</p>
      
      <h3>Self-Compassion as Foundation</h3>
      
      <p>Understanding our attachment patterns is not about blame—of ourselves or our caregivers. It's about comprehension and compassion. When we recognize that our relational difficulties have roots in survival strategies developed long ago, we can approach ourselves with more gentleness.</p>
      
      <p>The architecture of attachment is not destiny. It is the starting point from which we can consciously build more secure foundations for connection.</p>
    `,
    category: 'psychology',
    date: '2023-12-20',
    readingTime: 9,
    author: 'The Root Logic',
    imageUrl: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&q=80',
    layout: 'full',
  },
  {
    id: 'meaning-of-suffering',
    title: 'On the Meaning of Suffering',
    teaser: 'What the existentialists understood about pain that positive psychology often overlooks.',
    content: `
      <p>We live in an age that has declared war on suffering. Discomfort is medicalized. Difficulty is pathologized. The cultural message is clear: if you're suffering, something has gone wrong. But what if this framing is itself part of the problem?</p>
      
      <h2>The Existentialist Perspective</h2>
      
      <p>The existentialists—Kierkegaard, Nietzsche, Heidegger, Sartre—understood something that gets lost in our therapeutic culture. Suffering is not merely something to be eliminated. It can be a doorway to meaning, authenticity, and growth.</p>
      
      <blockquote>"To live is to suffer, to survive is to find some meaning in the suffering." — Friedrich Nietzsche</blockquote>
      
      <p>This is not a glorification of pain. It's a recognition that the attempt to construct a life free of all difficulty is not only impossible but impoverishing. Struggle is often where we discover what we're capable of and what truly matters to us.</p>
      
      <h2>Viktor Frankl's Insight</h2>
      
      <p>No one articulated this more powerfully than Viktor Frankl, the psychiatrist who survived Auschwitz. His logotherapy is built on the premise that humans can endure almost any suffering if they can find meaning in it. The question is not "Why am I suffering?" but "What is this suffering asking of me?"</p>
      
      <p>Frankl observed that in the camps, those who maintained a sense of purpose—a task to complete, a loved one to return to—were more likely to survive. Meaning doesn't eliminate suffering, but it transforms our relationship to it.</p>
      
      <h3>Beyond Toxic Positivity</h3>
      
      <p>The danger of positive psychology, when crudely applied, is that it can become another form of repression. If we're always supposed to be optimistic, where do the darker emotions go? They don't disappear; they go underground, often emerging later in destructive forms.</p>
      
      <p>A mature psychology—and a mature philosophy of life—makes room for the full range of human experience. It recognizes that sometimes the most loving thing we can do for ourselves is to sit with our suffering rather than immediately trying to fix it.</p>
    `,
    category: 'philosophy',
    date: '2023-12-10',
    readingTime: 7,
    author: 'The Root Logic',
    imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80',
    layout: 'wide',
  },
  {
    id: 'mercury-retrograde-mind',
    title: 'The Retrograde Mind',
    teaser: 'When life seems to move backwards, perhaps it is asking us to look within rather than ahead.',
    content: `
      <p>There are seasons in life when nothing seems to work. Communications break down. Plans unravel. The momentum we've built suddenly reverses. Rather than fighting these periods, what if we learned to work with them?</p>
      
      <h2>The Wisdom of Retreat</h2>
      
      <p>Nature moves in cycles, not straight lines. Seeds must winter underground before sprouting. Tides recede before they advance. Even the planets, from our earthly perspective, appear to move backward in their orbits—the phenomenon astrologers call retrograde.</p>
      
      <blockquote>"In the depth of winter, I finally learned that within me there lay an invincible summer." — Albert Camus</blockquote>
      
      <p>Psychologically, we too have retrograde periods—times when the psyche needs to turn inward, to process, to integrate. These are not wasted time. They are the underground work from which new growth emerges.</p>
      
      <h2>Productive Waiting</h2>
      
      <p>Our culture values action over reflection, movement over stillness. But some of the most important work we do happens in periods of apparent stagnation. The writer who can't write is often incubating something that isn't ready to be born. The person in the fallow period is often preparing for a transformation they can't yet see.</p>
      
      <p>The key is to distinguish between productive waiting and mere avoidance. Productive waiting is receptive—it listens, observes, remains open. Avoidance is closed off, distracted, refusing to engage with what the moment is offering.</p>
      
      <h3>Trusting the Process</h3>
      
      <p>Perhaps the deepest lesson of retrograde periods—whether literal or metaphorical—is in trusting a timing larger than our own. Not every season is for sowing. Some seasons are for allowing the soil to rest, for letting the rain fall, for waiting.</p>
      
      <p>The retrograde mind is not broken. It is simply moving in a different direction—one that our forward-focused culture often fails to honor. When we learn to work with these rhythms rather than against them, we discover a deeper intelligence at work in our lives.</p>
    `,
    category: 'gemini',
    date: '2023-12-01',
    readingTime: 6,
    author: 'The Root Logic',
    imageUrl: 'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?w=800&q=80',
    layout: 'narrow',
  },
];

export function getArticleById(id: string): Article | undefined {
  return articles.find(article => article.id === id);
}

export function getArticlesByCategory(category: Article['category']): Article[] {
  return articles.filter(article => article.category === category);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}
