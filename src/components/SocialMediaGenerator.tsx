import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Article, categories } from '@/data/articles';
import i18n from '@/i18n';
import { slugify, toUpper } from '@/lib/utils';
import html2canvas from 'html2canvas';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SocialMediaGeneratorProps {
  article: Article;
  onClose?: () => void;
}

const SocialMediaGenerator: React.FC<SocialMediaGeneratorProps> = ({ article, onClose }) => {
  const { t } = useTranslation();
  const componentRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [format, setFormat] = useState<'square' | 'portrait'>('portrait');
  const [currentPage, setCurrentPage] = useState(0);

  // Content processing for pagination
  const contentChunks = React.useMemo(() => {
    // Basic chunking strategy:
    // Page 0: Title + Subtitle (Cover)
    // Page 1+: Content split into ~500 char chunks
    // This is a heuristic approach. Ideal solution would measure height.
    
    const chunks = [];
    
    // Cover Slide
    chunks.push({
      type: 'cover',
      title: article.title,
      subtitle: article.subtitle,
      image: article.image_url
    });

    // Content Slides
    if (article.content) {
      // Remove markdown symbols for cleaner text
      const cleanText = article.content
        .replace(/[#*`]/g, '')
        .replace(/\n\n/g, ' ')
        .trim();
      
      const chunkSize = format === 'portrait' ? 600 : 350;
      let currentIndex = 0;
      
      while (currentIndex < cleanText.length) {
        let end = currentIndex + chunkSize;
        if (end < cleanText.length) {
          // Look for sentence end
          const lastPeriod = cleanText.lastIndexOf('.', end);
          if (lastPeriod > currentIndex + (chunkSize / 2)) {
            end = lastPeriod + 1;
          } else {
             // Look for space
             const lastSpace = cleanText.lastIndexOf(' ', end);
             if (lastSpace > currentIndex) end = lastSpace;
          }
        }
        
        chunks.push({
          type: 'content',
          text: cleanText.slice(currentIndex, end).trim()
        });
        currentIndex = end;
      }
    }

    return chunks;
  }, [article, format]);

  const currentSlide = contentChunks[currentPage];
  const totalPages = contentChunks.length;

  const handleDownload = async () => {
    if (componentRef.current) {
      setIsGenerating(true);
      try {
        // Force a small delay to ensure rendering is complete
        await new Promise(resolve => setTimeout(resolve, 100));

        const canvas = await html2canvas(componentRef.current, {
          scale: 2, // Retina quality
          useCORS: true, // For images from different domains
          backgroundColor: '#0F172A', // Dark mode background
          height: componentRef.current.offsetHeight, // Explicitly set height
          width: componentRef.current.offsetWidth,   // Explicitly set width
        });
        
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `rootlogic-post-${slugify(article.title)}-page-${currentPage + 1}.png`;
        link.click();
      } catch (error) {
        console.error('Error generating image:', error);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  // Get current date for the post
  const today = new Date().toLocaleDateString('tr-TR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  // Dimensions
  // Square: 1080x1080 -> Display: 500x500
  // Portrait: 1080x1350 (4:5) -> Display: 400x500
  const containerStyle = format === 'square' 
    ? { width: '500px', height: '500px' } 
    : { width: '400px', height: '500px' };

  return (
    <div className="flex flex-col items-center gap-6 p-4 select-none">
      {/* Controls */}
      <div className="flex items-center gap-4 bg-muted/50 p-2 rounded-lg border border-border/50">
        <Button 
          variant={format === 'square' ? 'default' : 'ghost'} 
          size="sm"
          onClick={() => setFormat('square')}
          className="gap-2"
        >
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          Square
        </Button>
        <Button 
          variant={format === 'portrait' ? 'default' : 'ghost'} 
          size="sm"
          onClick={() => setFormat('portrait')}
          className="gap-2"
        >
          <div className="w-3 h-4 border-2 border-current rounded-sm" />
          Portrait
        </Button>
      </div>

      <div className="bg-muted p-8 rounded-xl border border-border/50 shadow-2xl overflow-hidden relative group">
        
        {/* Navigation Arrows */}
        <div className="absolute top-1/2 -translate-y-1/2 left-2 z-50">
           <Button
             variant="secondary"
             size="icon"
             className="rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
             onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
             disabled={currentPage === 0}
           >
             <ChevronLeft className="w-4 h-4" />
           </Button>
        </div>
        
        <div className="absolute top-1/2 -translate-y-1/2 right-2 z-50">
           <Button
             variant="secondary"
             size="icon"
             className="rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
             onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
             disabled={currentPage === totalPages - 1}
           >
             <ChevronRight className="w-4 h-4" />
           </Button>
        </div>

        {/* The Instagram Post Container */}
        <div 
          ref={componentRef}
          className="relative bg-background flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300"
          style={{ 
            ...containerStyle,
            fontFamily: 'Inter, sans-serif' // San-serif fallback
          }}
        >
          {/* Header Branding */}
          <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-20">
             <div className="flex items-center gap-2">
                <Logo className="w-6 h-6 text-primary" />
                <span className="font-semibold text-xs tracking-tight">RootLogic</span>
             </div>
             <span className="text-[10px] tracking-[0.2em] uppercase font-medium opacity-60">
                {toUpper(t(categories[article.category as keyof typeof categories]?.label || 'Uncategorized'), i18n.language)}
             </span>
          </div>

          {/* Background Decorative Elements */}
          <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-primary/5 blur-[60px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-blue-500/5 blur-[80px]" />

          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center px-10 z-10 pt-20 pb-20">
            {currentSlide.type === 'cover' ? (
              <>
                <h1 className="font-serif text-3xl leading-[1.2] mb-6 text-foreground font-medium">
                  {currentSlide.title}
                </h1>
                
                {currentSlide.subtitle && (
                   <div className="relative pl-4 border-l-2 border-primary/30">
                     <p className="text-muted-foreground text-base leading-relaxed font-light opacity-90">
                       {currentSlide.subtitle}
                     </p>
                   </div>
                )}
              </>
            ) : (
              <div className="prose prose-invert prose-sm max-w-none">
                 <p className="font-serif text-xl leading-relaxed text-foreground/90 whitespace-pre-wrap">
                    {currentSlide.text}
                 </p>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="px-10 pb-8 flex justify-between items-end z-10">
            <div className="flex flex-col gap-0.5">
               <span className="text-[10px] font-medium uppercase tracking-wider text-primary">Read More</span>
               <span className="text-xs font-semibold opacity-80">rootlogic.app</span>
            </div>
            
            <div className="text-right">
               <span className="block text-[10px] uppercase tracking-widest opacity-50 mb-1">
                 {currentPage + 1} / {totalPages}
               </span>
               <div className="flex items-center gap-2 justify-end">
                  <span className="text-xs font-serif italic opacity-70">{today}</span>
               </div>
            </div>
          </div>

          {/* Image Overlay (Only for Cover Slide) */}
          {currentSlide.type === 'cover' && currentSlide.image && (
            <div className="absolute inset-0 z-0 opacity-[0.05] mix-blend-overlay">
               <img src={currentSlide.image} className="w-full h-full object-cover grayscale" />
            </div>
          )}
          
          {/* Border Frame */}
          <div className="absolute inset-0 border-[12px] border-background z-30 pointer-events-none" />
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-4 w-full justify-between">
        <div className="text-sm text-muted-foreground">
           Slide {currentPage + 1} of {totalPages}
        </div>
        
        <div className="flex gap-3">
            {onClose && (
                <Button variant="outline" onClick={onClose}>
                    Close
                </Button>
            )}
            <Button onClick={handleDownload} disabled={isGenerating} className="min-w-[140px]">
                {isGenerating ? (
                <>Generating...</>
                ) : (
                <>
                    <Download className="mr-2 h-4 w-4" /> Download Page
                </>
                )}
            </Button>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaGenerator;
