import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Article, categories } from '@/data/articles';
import i18n from '@/i18n';
import { slugify, toUpper } from '@/lib/utils';
import html2canvas from 'html2canvas';
import { ChevronLeft, ChevronRight, Download, RefreshCw, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SocialMediaGeneratorProps {
  article: Article;
  onClose?: () => void;
}

type Block = { type: 'header' | 'quote' | 'list' | 'paragraph'; content: string };
type Page = { 
  id: string; // unique id for key
  type: 'cover' | 'content'; 
  title?: string; 
  subtitle?: string; 
  image?: string; 
  blocks?: Block[];
};

/**
 * SOCIAL MEDIA GENERATOR - DEPRECATION NOTICE
 * 
 * Features: "Editable Preview" & "Smart Extraction"
 * Status: Experimental / Pending Removal
 * 
 * NOTE: These features were added to allow manual editing of generated slides.
 * However, they do not meet the desired quality standards for automation and workflow.
 * The code is kept for reference but is likely to be removed or significantly refactored in future iterations.
 */

const SocialMediaGenerator: React.FC<SocialMediaGeneratorProps> = ({ article, onClose }) => {
  const { t } = useTranslation();
  const componentRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [format, setFormat] = useState<'square' | 'portrait'>('portrait');
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState<Page[]>([]);

  // Initialize Pages with Smart Extraction
  useEffect(() => {
    generatePages();
  }, [article, format]);

  const generatePages = () => {
    const _pages: Page[] = [];

    // 1. Cover Page
    _pages.push({
      id: 'cover',
      type: 'cover',
      title: article.title,
      subtitle: article.subtitle,
      image: article.image_url
    });

    if (article.content) {
       // First, standardise newlines & clean markdown
       const rawContent = article.content.replace(/\r\n/g, '\n');
       const rawBlocks = rawContent.split(/\n\n+/);
       
       const cleanMarkdown = (text: string) => text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/_(.*?)_/g, '$1');

       let currentBlocks: Block[] = [];
       
       const flushPage = () => {
         if (currentBlocks.length > 0) {
           _pages.push({ 
             id: `page-${_pages.length}`,
             type: 'content', 
             blocks: [...currentBlocks] 
           });
           currentBlocks = [];
         }
       };

       rawBlocks.forEach(rawBlock => {
         const trimmed = rawBlock.trim();
         if (!trimmed) return;

         let block: Block;
         if (trimmed.startsWith('#')) {
            block = { type: 'header', content: cleanMarkdown(trimmed.replace(/^#+\s*/, '')) };
            // Header Strategy: Ideally starts a NEW page if there's previous content
            if (currentBlocks.length > 0) flushPage();
         } else if (trimmed.startsWith('>')) {
            block = { type: 'quote', content: cleanMarkdown(trimmed.replace(/^>\s*/, '')) };
         } else if (trimmed.match(/^[-*]\s/) || trimmed.match(/^\d+\.\s/)) {
            const items = trimmed.split(/\n/).map(i => cleanMarkdown(i.replace(/^[-*]\s*/, '').replace(/^\d+\.\s*/, '')).trim()).filter(Boolean);
            block = { type: 'list', content: items.join('\n') };
         } else {
            block = { type: 'paragraph', content: cleanMarkdown(trimmed) };
         }

         currentBlocks.push(block);

         // Pagination Capacity Check (Soft limit)
         // If current blocks exceed capacity, flush.
         const PAGE_CAPACITY = format === 'portrait' ? 1200 : 800; // Characters
         const currentSize = currentBlocks.reduce((acc, b) => acc + b.content.length + (b.type === 'header' ? 100 : 0), 0);
         
         if (currentSize > PAGE_CAPACITY) {
            flushPage();
         }
       });
       
       flushPage(); // Flush remaining
    }

    setPages(_pages);
    setCurrentPage(0);
  };

  // Safe current page accessor
  const currentSlide = pages[currentPage] || pages[0];
  const totalPages = pages.length;

  // -- Edit Handlers --
  const updateSlideTitle = (val: string) => {
    const newPages = [...pages];
    if (newPages[currentPage]) newPages[currentPage].title = val;
    setPages(newPages);
  };
  const updateSlideSubtitle = (val: string) => {
    const newPages = [...pages];
    if (newPages[currentPage]) newPages[currentPage].subtitle = val;
    setPages(newPages);
  };
  const updateBlockContent = (blockIndex: number, val: string) => {
    const newPages = [...pages];
    if (newPages[currentPage] && newPages[currentPage].blocks?.[blockIndex]) {
       newPages[currentPage].blocks![blockIndex].content = val;
    }
    setPages(newPages);
  };
  const deleteAppointedSlide = () => {
     if (pages.length <= 1) return; // Don't delete last page
     const newPages = pages.filter((_, idx) => idx !== currentPage);
     setPages(newPages);
     if (currentPage >= newPages.length) setCurrentPage(newPages.length - 1);
  };


  const handleDownload = async () => {
    if (componentRef.current) {
      setIsGenerating(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 100));
        const canvas = await html2canvas(componentRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#0F172A',
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

  const today = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const containerStyle = format === 'square' ? { width: '500px', height: '500px' } : { width: '400px', height: '500px' };

  if (!currentSlide) return null;

  return (
    <div className="flex flex-col items-center gap-6 p-4 select-none">
      <div className="flex items-center gap-4 bg-muted/50 p-2 rounded-lg border border-border/50 justify-between w-full max-w-[500px]">
        <div className="flex gap-2">
            <Button variant={format === 'square' ? 'default' : 'ghost'} size="sm" onClick={() => setFormat('square')} className="gap-2">
            <div className="w-4 h-4 border-2 border-current rounded-sm" /> Square
            </Button>
            <Button variant={format === 'portrait' ? 'default' : 'ghost'} size="sm" onClick={() => setFormat('portrait')} className="gap-2">
            <div className="w-3 h-4 border-2 border-current rounded-sm" /> Portrait
            </Button>
        </div>
        <div className="flex gap-2">
            <Button variant="ghost" size="icon" title="Reset / Re-generate" onClick={generatePages}>
                <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="destructive" size="icon" title="Delete this slide" onClick={deleteAppointedSlide} disabled={pages.length <= 1}>
                <Trash2 className="w-4 h-4" />
            </Button>
        </div>
      </div>

      <div className="bg-muted p-8 rounded-xl border border-border/50 shadow-2xl overflow-hidden relative group">
        <div className="absolute top-1/2 -translate-y-1/2 left-2 z-50">
           <Button variant="secondary" size="icon" className="rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0" onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0}>
             <ChevronLeft className="w-4 h-4" />
           </Button>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-2 z-50">
           <Button variant="secondary" size="icon" className="rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0" onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))} disabled={currentPage === totalPages - 1}>
             <ChevronRight className="w-4 h-4" />
           </Button>
        </div>

        <div ref={componentRef} className="relative bg-background flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300" style={containerStyle}>
          {/* Header */}
          <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-20 pointer-events-none">
             <div className="flex items-center gap-2">
                <Logo className="w-6 h-6 text-primary" />
                <span className="font-semibold text-[10px] tracking-tight">RootLogic</span>
             </div>
             <span className="text-[9px] tracking-[0.2em] uppercase font-medium opacity-60">
                {toUpper(t(categories[article.category as keyof typeof categories]?.label || 'Uncategorized'), i18n.language)}
             </span>
          </div>

          {/* Background FX */}
          <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-primary/5 blur-[60px] pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-blue-500/5 blur-[80px] pointer-events-none" />

          {/* Content Area */}
          <div className="flex-1 flex flex-col justify-center px-10 z-10 pt-20 pb-20">
            {currentSlide.type === 'cover' ? (
              <>
                <textarea 
                    value={currentSlide.title || ''}
                    onChange={(e) => updateSlideTitle(e.target.value)}
                    className="font-serif text-2xl leading-[1.2] mb-6 text-foreground font-medium bg-transparent border-none resize-none focus:ring-1 focus:ring-primary/20 rounded p-1 -ml-1 w-full overflow-hidden"
                    rows={3}
                />
                
                {currentSlide.subtitle && (
                   <div className="relative pl-4 border-l-2 border-primary/30">
                     <textarea 
                        value={currentSlide.subtitle}
                        onChange={(e) => updateSlideSubtitle(e.target.value)}
                        className="text-muted-foreground text-xs leading-relaxed font-light opacity-90 bg-transparent border-none resize-none focus:ring-1 focus:ring-primary/20 rounded p-1 -ml-1 w-full"
                        rows={4}
                     />
                   </div>
                )}
              </>
            ) : (
              <div className="flex flex-col gap-3">
                 {currentSlide.blocks?.map((block, idx) => {
                    if (block.type === 'header') return (
                        <textarea 
                            key={idx}
                            value={block.content}
                            onChange={(e) => updateBlockContent(idx, e.target.value)}
                            className="font-sans text-base font-semibold text-primary mt-2 bg-transparent border-none resize-none focus:ring-1 focus:ring-primary/20 rounded p-1 -ml-1 w-full"
                            rows={2}
                        />
                    );
                    if (block.type === 'quote') return (
                        <div key={idx} className="relative">
                            <blockquote className="border-l-2 border-primary/50 pl-4 italic text-muted-foreground text-[10px] bg-muted/20 py-2 pr-2 rounded-r">
                                <textarea 
                                    value={block.content}
                                    onChange={(e) => updateBlockContent(idx, e.target.value)}
                                    className="bg-transparent border-none resize-none focus:outline-none w-full"
                                    rows={3}
                                />
                            </blockquote>
                        </div>
                    );
                    if (block.type === 'list') return (
                        <div key={idx} className="flex gap-2 items-start pl-2">
                             <span className="text-primary mt-1 text-[10px]">•</span>
                             <textarea 
                                value={block.content}
                                onChange={(e) => updateBlockContent(idx, e.target.value)}
                                className="text-foreground/90 text-[11px] leading-relaxed bg-transparent border-none resize-none focus:ring-1 focus:ring-primary/20 rounded p-1 -ml-1 w-full"
                                rows={Math.max(2, block.content.split('\n').length)}
                             />
                        </div>
                    );
                    return (
                        <textarea 
                            key={idx}
                            value={block.content}
                            onChange={(e) => updateBlockContent(idx, e.target.value)}
                            className="text-foreground/90 leading-relaxed font-serif text-[11px] text-justify bg-transparent border-none resize-none focus:ring-1 focus:ring-primary/20 rounded p-1 -ml-1 w-full"
                            rows={Math.ceil(block.content.length / 50)}
                        />
                    );
                 })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-10 pb-8 flex justify-between items-end z-10 pointer-events-none">
            <div className="flex flex-col gap-0.5">
               <span className="text-[9px] font-medium uppercase tracking-wider text-primary">Read More</span>
               <span className="text-[10px] font-semibold opacity-80">rootlogic.app</span>
            </div>
            <div className="text-right">
               <span className="block text-[9px] uppercase tracking-widest opacity-50 mb-1">{currentPage + 1} / {totalPages}</span>
               <div className="flex items-center gap-2 justify-end"><span className="text-[10px] font-serif italic opacity-70">{today}</span></div>
            </div>
          </div>

          {/* Cover Overlay */}
          {currentSlide.type === 'cover' && currentSlide.image && (
            <div className="absolute inset-0 z-0 opacity-[0.05] mix-blend-overlay pointer-events-none"><img src={currentSlide.image} className="w-full h-full object-cover grayscale" /></div>
          )}
          
          <div className="absolute inset-0 border-[12px] border-background z-30 pointer-events-none" />
        </div>
      </div>
      
      <div className="flex items-center gap-4 w-full justify-between">
        <div className="text-sm text-muted-foreground">Slide {currentPage + 1} of {totalPages}</div>
        <div className="flex gap-3">
            {onClose && <Button variant="outline" onClick={onClose}>Close</Button>}
            <Button onClick={handleDownload} disabled={isGenerating} className="min-w-[140px]">
                {isGenerating ? <>Generating...</> : <><Download className="mr-2 h-4 w-4" /> Download Page</>}
            </Button>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaGenerator;
