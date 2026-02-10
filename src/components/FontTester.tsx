import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, BookmarkPlus, CheckCircle2, Settings2, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface FontPreset {
  id: string;
  name: string;
  serifFont: string;
  serifWeight: string;
  serifSize: string;
  sansFont: string;
  sansSize: string;
  uiFont: string;
  uiWeight: string;
  uiSize: string;
  uiSpacing: string;
}

const FontTester = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [serifFont, setSerifFont] = useState('Georama');
  const [serifWeight, setSerifWeight] = useState('500');
  const [serifSize, setSerifSize] = useState('1.5');
  const [sansFont, setSansFont] = useState('Newsreader');
  const [sansSize, setSansSize] = useState('1.1');
  const [uiFont, setUiFont] = useState('Georama');
  const [uiWeight, setUiWeight] = useState('600');
  const [uiSize, setUiSize] = useState('0.9');
  const [uiSpacing, setUiSpacing] = useState('0.1');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [favorites, setFavorites] = useState<FontPreset[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('font-favorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const applyPreset = (preset: Partial<FontPreset>) => {
    setSerifFont(preset.serifFont || 'Georama');
    setSerifWeight(preset.serifWeight || '500');
    setSerifSize(preset.serifSize || '1.5');
    setSansFont(preset.sansFont || 'Newsreader');
    setSansSize(preset.sansSize || '1.1');
    setUiFont(preset.uiFont || 'Georama');
    setUiWeight(preset.uiWeight || '600');
    setUiSize(preset.uiSize || '0.9');
    setUiSpacing(preset.uiSpacing || '0.1');
    applyFonts(true, preset);
  };

  const loadGoogleFont = (fontName: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!fontName) return resolve();
      const linkId = `google-font-${fontName.toLowerCase().replace(/ /g, '-')}`;
      if (document.getElementById(linkId)) return resolve();
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap`;
      link.onload = () => {
        setTimeout(() => {
          document.fonts.load(`1em "${fontName}"`).then(() => resolve()).catch(reject);
        }, 100);
      };
      link.onerror = () => reject(new Error('Link failed to load'));
      document.head.appendChild(link);
    });
  };

  const applyFonts = async (loadFromGoogle = false, override?: Partial<FontPreset>) => {
    setStatus('loading');
    
    const sFont = override?.serifFont || serifFont;
    const nFont = override?.sansFont || sansFont;
    const uFont = override?.uiFont || uiFont;

    try {
      if (loadFromGoogle) {
        await Promise.all([
          loadGoogleFont(sFont),
          loadGoogleFont(nFont),
          loadGoogleFont(uFont)
        ]);
      }

      const root = document.documentElement;
      root.style.setProperty('--font-serif', `'${sFont}', sans-serif`);
      root.style.setProperty('--font-serif-weight', override?.serifWeight || serifWeight);
      root.style.setProperty('--font-serif-size', override?.serifSize || serifSize);
      
      root.style.setProperty('--font-sans', `'${nFont}', serif`);
      root.style.setProperty('--font-sans-size', override?.sansSize || sansSize);
      
      root.style.setProperty('--font-ui', `'${uFont}', sans-serif`);
      root.style.setProperty('--font-ui-weight', override?.uiWeight || uiWeight);
      root.style.setProperty('--font-ui-size', override?.uiSize || uiSize);
      root.style.setProperty('--font-ui-spacing', `${override?.uiSpacing || uiSpacing}em`);
      
      setStatus('success');
      toast.success(`Applied settings`);
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      console.error(error);
      setStatus('error');
      toast.error('Font load failed');
    }
  };

  const addFavorite = () => {
    const name = prompt('Preset name:');
    if (!name) return;

    const newPreset: FontPreset = {
      id: Date.now().toString(),
      name,
      serifFont, serifWeight, serifSize,
      sansFont, sansSize,
      uiFont, uiWeight, uiSize, uiSpacing
    };

    const updated = [...favorites, newPreset];
    setFavorites(updated);
    localStorage.setItem('font-favorites', JSON.stringify(updated));
    toast.success('Saved to Library');
  };

  const deleteFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = favorites.filter(f => f.id !== id);
    setFavorites(updated);
    localStorage.setItem('font-favorites', JSON.stringify(updated));
  };

  const resetFonts = () => {
    setSerifFont('Georama'); setSerifWeight('500'); setSerifSize('1.5');
    setSansFont('Newsreader'); setSansSize('1.1');
    setUiFont('Georama'); setUiWeight('600'); setUiSize('0.9'); setUiSpacing('0.1');
    applyFonts(true, {
      serifFont: 'Georama', serifWeight: '500', serifSize: '1.5',
      sansFont: 'Newsreader', sansSize: '1.1',
      uiFont: 'Georama', uiWeight: '600', uiSize: '0.9', uiSpacing: '0.1'
    });
    toast.info('Typography reset');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[100] p-3 bg-background border border-border rounded-full shadow-lg hover:bg-secondary transition-all hover:scale-110"
      >
        <Settings2 size={20} className={status === 'loading' ? 'animate-spin text-primary' : 'text-foreground'} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className="fixed bottom-20 right-6 z-[100] w-80 bg-card border border-border shadow-2xl p-6 rounded-lg backdrop-blur-md"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg text-primary font-bold">Typography Lab</h3>
                {status === 'success' && <CheckCircle2 size={16} className="text-green-500" />}
                {status === 'error' && <AlertCircle size={16} className="text-red-500" />}
              </div>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
              {/* Library */}
              {favorites.length > 0 && (
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground block">Your Library</label>
                  <div className="grid grid-cols-1 gap-1">
                    {favorites.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => applyPreset(preset)}
                        className="text-[10px] text-left px-3 py-2 rounded border border-border/50 hover:bg-secondary transition-colors flex justify-between items-center group bg-secondary/20"
                      >
                        <span className="truncate">{preset.name}</span>
                        <Trash2 size={12} className="text-muted-foreground hover:text-destructive hidden group-hover:block" onClick={(e) => deleteFavorite(preset.id, e)} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* HEADING SECTION */}
              <div className="space-y-4 pt-2 border-t border-border/40">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary">Headings (Serif)</label>
                    <span className="cursor-pointer hover:text-primary p-1" onClick={addFavorite}>
                      <BookmarkPlus size={14} />
                    </span>
                  </div>
                  <Input value={serifFont} onChange={(e) => setSerifFont(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && applyFonts(true)} className="h-8 text-xs" placeholder="Font Family" />
                  <div className="grid grid-cols-2 gap-2">
                    <select value={serifWeight} onChange={(e) => setSerifWeight(e.target.value)} className="h-7 bg-background border border-border rounded text-[10px] px-1 outline-none">
                      {['300', '400', '500', '600', '700', '800'].map(w => <option key={w} value={w}>Weight: {w}</option>)}
                    </select>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-muted-foreground px-1">Scale: {serifSize}x</span>
                      <input type="range" min="0.5" max="2.5" step="0.05" value={serifSize} onChange={(e) => setSerifSize(e.target.value)} className="accent-primary h-4" />
                    </div>
                  </div>
                </div>

                {/* BODY SECTION */}
                <div className="space-y-3 pt-4 border-t border-border/20">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary">Body (Sans)</label>
                  <Input value={sansFont} onChange={(e) => setSansFont(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && applyFonts(true)} className="h-8 text-xs" placeholder="Font Family" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-muted-foreground px-1">Scale: {sansSize}x</span>
                    <input type="range" min="0.5" max="2" step="0.05" value={sansSize} onChange={(e) => setSansSize(e.target.value)} className="w-full accent-primary h-4" />
                  </div>
                </div>

                {/* UI SECTION */}
                <div className="space-y-3 pt-4 border-t border-border/20">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary">UI / Labels</label>
                  <Input value={uiFont} onChange={(e) => setUiFont(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && applyFonts(true)} className="h-8 text-xs" placeholder="Font Family" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-muted-foreground px-1">Weight: {uiWeight}</span>
                      <input type="range" min="100" max="900" step="100" value={uiWeight} onChange={(e) => setUiWeight(e.target.value)} className="accent-primary h-4" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-muted-foreground px-1">Scale: {uiSize}x</span>
                      <input type="range" min="0.5" max="1.5" step="0.05" value={uiSize} onChange={(e) => setUiSize(e.target.value)} className="accent-primary h-4" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-muted-foreground px-1">Spacing: {uiSpacing}em</span>
                    <input type="range" min="0" max="0.5" step="0.01" value={uiSpacing} onChange={(e) => setUiSpacing(e.target.value)} className="w-full accent-primary h-4" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border/40 pb-2">
                <Button onClick={() => applyFonts(true)} size="sm" className="w-full text-[10px] h-8 gap-1">
                   Apply & Fetch
                </Button>
                <Button onClick={resetFonts} variant="outline" size="sm" className="w-full text-[10px] h-8">
                  Reset
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FontTester;
