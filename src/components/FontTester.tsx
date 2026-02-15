import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import { BookmarkPlus, CheckCircle2, ChevronDown, ChevronUp, Settings2, Trash2, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface FontValues {
  family: string;
  weight: string;
  size: string;
  spacing?: string;
}

interface FontPreset {
  id: string;
  name: string;
  logo: FontValues;
  ui: FontValues;
  category: FontValues;
  title: FontValues;
  subtitle: FontValues;
  heading: FontValues;
  body: FontValues;
  code: Partial<FontValues>;
}

const DEFAULT_FONTS: Omit<FontPreset, 'id' | 'name'> = {
  logo: { family: 'Amarante', weight: '600', size: '1.5', spacing: '-0.03' },
  ui: { family: 'Inconsolata', weight: '300', size: '0.7', spacing: '0.1' },
  category: { family: 'Inconsolata', weight: '600', size: '0.75', spacing: '0.2' },
  title: { family: 'M PLUS Code Latin', weight: '600', size: '2.5' },
  subtitle: { family: 'Sofia Sans', weight: '400', size: '1.25' },
  heading: { family: 'M PLUS Code Latin', weight: '500', size: '1.75' },
  body: { family: 'Sofia Sans Semi Condensed', weight: '300', size: '1.1' },
  code: { family: 'JetBrains Mono', size: '0.9' }
};

const CustomInput = ({ value, onChange, placeholder }: { value: string, onChange: (val: string) => void, placeholder?: string }) => (
  <Input 
    value={value} 
    onChange={(e) => onChange(e.target.value)}
    onKeyDown={(e) => e.stopPropagation()}
    className="h-7 text-xs" 
    placeholder={placeholder}
  />
);

const Section = ({ title, id, activeSection, setActiveSection, children }: { title: string, id: string, activeSection: string | null, setActiveSection: (id: string | null) => void, children: React.ReactNode }) => (
  <div className="space-y-3 border-t border-border/20 pt-4 first:border-0 first:pt-0">
    <button 
      onClick={() => setActiveSection(activeSection === id ? null : id)}
      className="flex items-center justify-between w-full group"
    >
      <label className="text-[10px] font-bold uppercase tracking-widest text-primary cursor-pointer group-hover:text-primary/70 flex items-center gap-2">
          {title}
      </label>
      {activeSection === id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
    </button>
    <AnimatePresence initial={false}>
      {activeSection === id && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div className="space-y-3 pt-1 pb-2">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FontTester = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>('title');
  const [fonts, setFonts] = useState<Omit<FontPreset, 'id' | 'name'>>(DEFAULT_FONTS);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [favorites, setFavorites] = useState<FontPreset[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('font-favorites-v2');
    if (saved) setFavorites(JSON.parse(saved));

    const root = document.documentElement;
    const style = getComputedStyle(root);
    const getVar = (name: string) => style.getPropertyValue(name).trim();
    const cleanFont = (val: string) => val.replace(/['"]/g, '').split(',')[0].trim();
    const cleanNum = (val: string) => val.replace(/[^\d.-]/g, '');

    const syncRegion = (key: keyof Omit<FontPreset, 'id' | 'name'>, prefix: string, hasSpacing = false) => {
      const family = getVar(`--font-${prefix}`);
      if (family) {
        setFonts(prev => ({
          ...prev,
          [key]: {
            family: cleanFont(family),
            weight: cleanNum(getVar(`--font-${prefix}-weight`)) || prev[key as keyof typeof DEFAULT_FONTS].weight,
            size: cleanNum(getVar(`--font-${prefix}-size`)) || prev[key as keyof typeof DEFAULT_FONTS].size,
            spacing: hasSpacing ? cleanNum(getVar(`--font-${prefix}-spacing`)) || prev[key as keyof typeof DEFAULT_FONTS].spacing : undefined
          }
        }));
      }
    };

    syncRegion('logo', 'logo', true);
    syncRegion('ui', 'ui', true);
    syncRegion('category', 'category', true);
    syncRegion('title', 'title');
    syncRegion('subtitle', 'subtitle');
    syncRegion('heading', 'heading');
    syncRegion('body', 'body');
    
    const codeFont = getVar('--font-code');
    if (codeFont) {
        setFonts(prev => ({
            ...prev,
            code: {
                family: cleanFont(codeFont),
                size: cleanNum(getVar('--font-code-size')) || prev.code.size
            }
        }));
    }
  }, []);

  const loadGoogleFont = async (fontName: string): Promise<void> => {
    if (!fontName) return;
    const linkId = `google-font-${fontName.toLowerCase().replace(/ /g, '-')}`;
    if (document.getElementById(linkId)) return;

    const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap`;
    
    try {
      const response = await fetch(fontUrl, { method: 'HEAD' });
      if (!response.ok) return;

      return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = fontUrl;
        link.onload = () => setTimeout(() => resolve(), 150);
        link.onerror = () => reject(new Error('Link failed'));
        document.head.appendChild(link);
      });
    } catch (e) {
      console.warn(`Font load error: ${fontName}`);
    }
  };

  const applyFonts = async (loadFromGoogle = false, override?: Omit<FontPreset, 'id' | 'name'>) => {
    setStatus('loading');
    const targetFonts = override || fonts;

    try {
      if (loadFromGoogle) {
        const uniqueFonts = Array.from(new Set([
          targetFonts.logo.family,
          targetFonts.ui.family,
          targetFonts.category.family,
          targetFonts.title.family,
          targetFonts.subtitle.family,
          targetFonts.heading.family,
          targetFonts.body.family,
          targetFonts.code.family
        ].filter(Boolean) as string[]));
        
        await Promise.all(uniqueFonts.map(f => loadGoogleFont(f)));
      }

      const root = document.documentElement;
      const setFontVars = (prefix: string, vals: Partial<FontValues>) => {
        if (vals.family) root.style.setProperty(`--font-${prefix}`, `'${vals.family}', sans-serif`);
        if (vals.weight) root.style.setProperty(`--font-${prefix}-weight`, vals.weight);
        if (vals.size) root.style.setProperty(`--font-${prefix}-size`, vals.size);
        if (vals.spacing) root.style.setProperty(`--font-${prefix}-spacing`, `${vals.spacing}em`);
      };

      setFontVars('logo', targetFonts.logo);
      setFontVars('ui', targetFonts.ui);
      setFontVars('category', targetFonts.category);
      setFontVars('title', targetFonts.title);
      setFontVars('subtitle', targetFonts.subtitle);
      setFontVars('heading', targetFonts.heading);
      setFontVars('body', targetFonts.body);
      
      if (targetFonts.code.family) root.style.setProperty('--font-code', `'${targetFonts.code.family}', monospace`);
      if (targetFonts.code.size) root.style.setProperty('--font-code-size', targetFonts.code.size);
      
      setStatus('success');
      toast.success(`Applied settings`);
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      console.error(error);
      setStatus('error');
      toast.error('Font load failed');
    }
  };

  const savePreset = () => {
    const name = prompt('Preset name:');
    if (!name) return;
    const newPreset: FontPreset = { id: Date.now().toString(), name, ...fonts };
    const updated = [...favorites, newPreset];
    setFavorites(updated);
    localStorage.setItem('font-favorites-v2', JSON.stringify(updated));
    toast.success('Saved to Library');
  };

  const deleteFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = favorites.filter(f => f.id !== id);
    setFavorites(updated);
    localStorage.setItem('font-favorites-v2', JSON.stringify(updated));
  };

  const updateFont = useCallback((region: keyof Omit<FontPreset, 'id' | 'name'>, key: keyof FontValues, value: string) => {
    setFonts(prev => ({
      ...prev,
      [region]: { ...prev[region], [key]: value }
    }));
  }, []);

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
            id="typography-lab"
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className="fixed bottom-20 right-6 z-[100] w-80 bg-card border border-border shadow-2xl p-6 rounded-lg backdrop-blur-md"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg text-primary font-bold">Typography Lab</h3>
                {status === 'success' && <CheckCircle2 size={16} className="text-green-500" />}
              </div>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              {/* Library */}
              {favorites.length > 0 && (
                <div className="space-y-2 pb-4 border-b border-border/40">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground block">Presets</label>
                  <div className="grid grid-cols-1 gap-1">
                    {favorites.map((f) => (
                      <button key={f.id} onClick={() => { setFonts(f); applyFonts(true, f); }} className="text-[10px] text-left px-3 py-2 rounded border border-border/50 hover:bg-secondary transition-colors flex justify-between items-center group bg-secondary/10">
                        <span className="truncate">{f.name}</span>
                        <Trash2 size={12} className="text-muted-foreground hover:text-destructive hidden group-hover:block" onClick={(e) => deleteFavorite(f.id, e)} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Section id="logo" title="1: Logo" activeSection={activeSection} setActiveSection={setActiveSection}>
                <CustomInput value={fonts.logo.family} onChange={(val) => updateFont('logo', 'family', val)} />
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-muted-foreground">W: {fonts.logo.weight}</span>
                    <input type="range" min="100" max="900" step="100" value={fonts.logo.weight} onChange={(e) => updateFont('logo', 'weight', e.target.value)} className="w-full h-2 accent-primary" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-muted-foreground">S: {fonts.logo.size}x</span>
                    <input type="range" min="0.5" max="3" step="0.05" value={fonts.logo.size} onChange={(e) => updateFont('logo', 'size', e.target.value)} className="w-full h-2 accent-primary" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-muted-foreground">L: {fonts.logo.spacing}</span>
                    <input type="range" min="-0.1" max="0.5" step="0.01" value={fonts.logo.spacing} onChange={(e) => updateFont('logo', 'spacing', e.target.value)} className="w-full h-2 accent-primary" />
                  </div>
                </div>
              </Section>

              <Section id="ui" title="2: Meta & Nav" activeSection={activeSection} setActiveSection={setActiveSection}>
                <CustomInput value={fonts.ui.family} onChange={(val) => updateFont('ui', 'family', val)} />
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-muted-foreground">W: {fonts.ui.weight}</span>
                    <input type="range" min="100" max="900" step="100" value={fonts.ui.weight} onChange={(e) => updateFont('ui', 'weight', e.target.value)} className="w-full h-2 accent-primary" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-muted-foreground">S: {fonts.ui.size}x</span>
                    <input type="range" min="0.5" max="2" step="0.05" value={fonts.ui.size} onChange={(e) => updateFont('ui', 'size', e.target.value)} className="w-full h-2 accent-primary" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-muted-foreground">L: {fonts.ui.spacing}</span>
                    <input type="range" min="0" max="0.5" step="0.01" value={fonts.ui.spacing} onChange={(e) => updateFont('ui', 'spacing', e.target.value)} className="w-full h-2 accent-primary" />
                  </div>
                </div>
              </Section>

              <Section id="category" title="3: Category" activeSection={activeSection} setActiveSection={setActiveSection}>
                <CustomInput value={fonts.category.family} onChange={(val) => updateFont('category', 'family', val)} />
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-muted-foreground">W: {fonts.category.weight}</span>
                    <input type="range" min="100" max="900" step="100" value={fonts.category.weight} onChange={(e) => updateFont('category', 'weight', e.target.value)} className="w-full h-2 accent-primary" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-muted-foreground">S: {fonts.category.size}x</span>
                    <input type="range" min="0.5" max="2" step="0.05" value={fonts.category.size} onChange={(e) => updateFont('category', 'size', e.target.value)} className="w-full h-2 accent-primary" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-muted-foreground">L: {fonts.category.spacing}</span>
                    <input type="range" min="0" max="0.5" step="0.01" value={fonts.category.spacing} onChange={(e) => updateFont('category', 'spacing', e.target.value)} className="w-full h-2 accent-primary" />
                  </div>
                </div>
              </Section>

              <Section id="title" title="4: Article H1" activeSection={activeSection} setActiveSection={setActiveSection}>
                <CustomInput value={fonts.title.family} onChange={(val) => updateFont('title', 'family', val)} />
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-muted-foreground">Weight: {fonts.title.weight}</span>
                    <input type="range" min="100" max="900" step="100" value={fonts.title.weight} onChange={(e) => updateFont('title', 'weight', e.target.value)} className="w-full h-2 accent-primary" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-muted-foreground">Scale: {fonts.title.size}x</span>
                    <input type="range" min="1" max="5" step="0.05" value={fonts.title.size} onChange={(e) => updateFont('title', 'size', e.target.value)} className="w-full h-2 accent-primary" />
                  </div>
                </div>
              </Section>

              <Section id="subtitle" title="5: Subtitle" activeSection={activeSection} setActiveSection={setActiveSection}>
                <CustomInput value={fonts.subtitle.family} onChange={(val) => updateFont('subtitle', 'family', val)} />
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-muted-foreground">Weight: {fonts.subtitle.weight}</span>
                    <input type="range" min="100" max="900" step="100" value={fonts.subtitle.weight} onChange={(e) => updateFont('subtitle', 'weight', e.target.value)} className="w-full h-2 accent-primary" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-muted-foreground">Scale: {fonts.subtitle.size}x</span>
                    <input type="range" min="0.5" max="3" step="0.05" value={fonts.subtitle.size} onChange={(e) => updateFont('subtitle', 'size', e.target.value)} className="w-full h-2 accent-primary" />
                  </div>
                </div>
              </Section>

              <Section id="heading" title="6: Article H2" activeSection={activeSection} setActiveSection={setActiveSection}>
                <CustomInput value={fonts.heading.family} onChange={(val) => updateFont('heading', 'family', val)} />
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-muted-foreground">Weight: {fonts.heading.weight}</span>
                    <input type="range" min="100" max="900" step="100" value={fonts.heading.weight} onChange={(e) => updateFont('heading', 'weight', e.target.value)} className="w-full h-2 accent-primary" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-muted-foreground">Scale: {fonts.heading.size}x</span>
                    <input type="range" min="1" max="4" step="0.05" value={fonts.heading.size} onChange={(e) => updateFont('heading', 'size', e.target.value)} className="w-full h-2 accent-primary" />
                  </div>
                </div>
              </Section>

              <Section id="body" title="7: Body text" activeSection={activeSection} setActiveSection={setActiveSection}>
                <CustomInput value={fonts.body.family} onChange={(val) => updateFont('body', 'family', val)} />
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-muted-foreground">Weight: {fonts.body.weight}</span>
                    <input type="range" min="100" max="900" step="100" value={fonts.body.weight} onChange={(e) => updateFont('body', 'weight', e.target.value)} className="w-full h-2 accent-primary" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-muted-foreground">Scale: {fonts.body.size}x</span>
                    <input type="range" min="0.5" max="2" step="0.05" value={fonts.body.size} onChange={(e) => updateFont('body', 'size', e.target.value)} className="w-full h-2 accent-primary" />
                  </div>
                </div>
              </Section>

              <Section id="code" title="Code (Markdown)" activeSection={activeSection} setActiveSection={setActiveSection}>
                <CustomInput value={fonts.code.family || ''} onChange={(val) => setFonts(prev => ({ ...prev, code: { ...prev.code, family: val } }))} />
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-muted-foreground">Scale: {fonts.code.size}x</span>
                    <input type="range" min="0.5" max="2" step="0.05" value={fonts.code.size} onChange={(e) => setFonts(prev => ({ ...prev, code: { ...prev.code, size: e.target.value } }))} className="w-full h-2 accent-primary" />
                </div>
              </Section>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-6 border-t border-border/40 pb-2">
              <Button onClick={() => applyFonts(true)} size="sm" className="w-full text-[10px] h-8 gap-1">
                 Apply All
              </Button>
              <Button onClick={savePreset} variant="outline" size="sm" className="w-full text-[10px] h-8 gap-1">
                <BookmarkPlus size={12} /> Save
              </Button>
            </div>
            <Button onClick={() => { setFonts(DEFAULT_FONTS); applyFonts(true, DEFAULT_FONTS); }} variant="link" className="w-full text-[9px] h-6 opacity-50">Reset to Factory</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FontTester;
