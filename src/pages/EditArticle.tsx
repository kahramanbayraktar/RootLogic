import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import instructionsData from '@/data/article_instructions.json';
import { Article, deleteArticle, fetchArticleById, updateArticle, uploadImageFromUrl } from '@/data/articles';
import { generateImageWithGemini, generateTextWithGemini } from '@/lib/gemini';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Sparkles, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import * as z from 'zod';

import { fetchCategories } from '@/data/categories';
import { fetchTopics } from '@/data/topics';

const articleSchema = z.object({
  id: z.string().min(3, 'Slug must be at least 3 characters'),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  subtitle: z.string().optional(),
  teaser: z.string().min(10, 'Teaser must be at least 10 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  category: z.string().min(1, 'Category is required'),
  date: z.string(),
  reading_time: z.coerce.number().min(1),
  author: z.string().min(2),
  image_url: z.string().url().optional().or(z.literal('')),
  layout: z.enum(['wide', 'narrow', 'full']).default('wide'),
  ai_instructions: z.string().optional(),
  topic: z.string().optional().nullable(),
});

const EditArticle = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: categories = [] } = useQuery({
      queryKey: ['categories'],
      queryFn: fetchCategories,
  });

  const { data: topics = [] } = useQuery({
      queryKey: ['topics'],
      queryFn: fetchTopics,
  });

  const { data: article, isLoading, isError } = useQuery({
    queryKey: ['article', id],
    queryFn: () => (id ? fetchArticleById(id) : Promise.resolve(null)),
    enabled: !!id,
  });

  const form = useForm<z.infer<typeof articleSchema>>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      id: '',
      title: '',
      subtitle: '',
      teaser: '',
      content: '',
      category: 'psychology',
      date: new Date().toISOString().split('T')[0],
      reading_time: 5,
      author: 'The Root Logic',
      image_url: '',
      layout: 'wide',
      ai_instructions: instructionsData.template1,
      topic: null,
    },
  });

  const title = form.watch('title');
  const subtitle = form.watch('subtitle');

  const generateAIImage = async () => {
    if (!title) {
       toast.error('Please enter a title first');
       return;
    }
    
    // Using default model from env or fallback
    const toastId = toast.loading('Generating image with AI...');
    try {
       // Improved prompt to focus on visual concepts and avoid text rendering
       const prompt = `A conceptual art piece reflecting the themes of "${title}"${subtitle ? ' and "' + subtitle + '"' : ''}. Minimalist, abstract, 4k resolution, cinematic lighting, editorial style. NO TEXT, NO LETTERS, NO WATERMARKS, NO TYPOGRAPHY. The image should be completely void of any written words.`;
       
       const result = await generateImageWithGemini(prompt);
      
       if (result.error) {
         throw new Error(result.error);
       }
       
       if (result.url) {
         form.setValue('image_url', result.url, { shouldValidate: true });
         toast.success('Image generated (URL)', { id: toastId });
       } else if (result.base64) {
         form.setValue('image_url', result.base64, { shouldValidate: true });
         toast.success('Image generated (Base64)', { id: toastId });
       }
    } catch (error) {
       console.error(error);
       toast.error('AI generation failed. Check API Key.', { id: toastId });
    }
  };

  const generateAIContent = async () => {
     const toastId = toast.loading('Generating article content...');
     
     // Use instructions from the form field (which defaults to JSON content but is editable)
     const currentInstructions = form.getValues('ai_instructions');
     // Title is now optional context, not mandatory
     const topic = `${title || 'the main topic'}${subtitle ? ': ' + subtitle : ''}`;
     
     if (!currentInstructions) {
        toast.error('Instructions are missing.');
        return;
     }
 
     const prompt = `${currentInstructions} "${topic}"
     
     Additional Context:
     Category: ${form.getValues('category')}.
     Target Length: around 800 words.`;

    try {
        const { text, error } = await generateTextWithGemini(prompt);
        if (error) throw new Error(error);
        
        if (text) {
            form.setValue('content', text, { shouldValidate: true });
            
            // Generate a teaser if empty
            if (!form.getValues('teaser')) {
                const teaserPrompt = `Write a 2 sentence teaser for this article: ${title}`;
                const teaserRes = await generateTextWithGemini(teaserPrompt);
                if (teaserRes.text) {
                    form.setValue('teaser', teaserRes.text, { shouldValidate: true });
                }
            }
            
            toast.success('Content generated', { id: toastId });
        }
    } catch (e) {
        console.error(e);
        toast.error('Failed to generate text', { id: toastId });
    }
  };

  useEffect(() => {
    if (article) {
      form.reset({
        id: article.id,
        title: article.title,
        subtitle: article.subtitle || '',
        teaser: article.teaser,
        content: article.content,
        category: article.category,
        date: article.date,
        reading_time: article.reading_time,
        author: article.author,
        image_url: article.image_url || '',
        layout: article.layout || 'wide',
        ai_instructions: instructionsData.template1, // Always load default template for consistency
        topic: article.topic || null,
      });
    }
  }, [article, form]);

  async function onSubmit(values: z.infer<typeof articleSchema>) {
    if (!id) return;
    setIsSubmitting(true);
    try {
      let finalImageUrl = values.image_url;

      // If it's an external URL (pollinations, unsplash, etc.), upload to Supabase Storage
      if (values.image_url && !values.image_url.includes('supabase.co')) {
        toast.info('Uploading image to permanent storage...');
        const uploadedUrl = await uploadImageFromUrl(values.image_url, id);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        }
      }

      const articleData: Partial<Article> = {
        title: values.title,
        subtitle: values.subtitle,
        teaser: values.teaser,
        content: values.content,
        category: values.category,
        date: values.date,
        reading_time: values.reading_time,
        author: values.author,

        image_url: finalImageUrl || null,
        layout: values.layout,
        topic: values.topic === '_none' ? null : values.topic,
      };

      const result = await updateArticle(id, articleData);
      
      if (result) {
        toast.success('Article updated successfully!');
        navigate(`/article/${result.id}`);
      } else {
        toast.error('Failed to update article.');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!id || !window.confirm('Are you sure you want to delete this article?')) return;
    
    setIsDeleting(true);
    try {
      const success = await deleteArticle(id);
      if (success) {
        toast.success('Article deleted successfully');
        navigate('/');
      } else {
        toast.error('Failed to delete article');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while deleting');
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse font-serif text-2xl italic">Retrieving the article...</div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="font-serif text-xl">Article not found.</p>
        <Button onClick={() => navigate('/')}>Back to Library</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-8">
              <h1 className="font-serif text-4xl">Edit Entry</h1>
              <Button 
                variant="destructive" 
                size="icon" 
                onClick={handleDelete}
                disabled={isDeleting}
                title="Delete Article"
              >
                <Trash2 size={20} />
              </Button>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Subtitle (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Exploring the deep connection between mind and matter" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug (ID)</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormDescription>Slug cannot be changed</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.length > 0 ? (
                              categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.slug}>
                                  {t(cat.label)}
                                </SelectItem>
                              ))
                            ) : (
                              <>
                                <SelectItem value="psychology">{t('cat_psychology')}</SelectItem>
                                <SelectItem value="philosophy">{t('cat_philosophy')}</SelectItem>
                                <SelectItem value="health">{t('cat_health')}</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dossier / Topic (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || '_none'}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a dossier (optional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="_none">None</SelectItem>
                            {topics.map((t) => (
                              <SelectItem key={t.id} value={t.slug}>
                                {t.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Assign to a curated dossier section</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="teaser"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Teaser</FormLabel>
                        <FormControl>
                          <Textarea 
                            className="resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ai_instructions"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>AI Architecture Instructions (The Root Architect)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="System instructions..." 
                            className="resize-y min-h-[150px] font-mono text-xs text-muted-foreground" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="flex justify-between items-center">
                          Content (Markdown)
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={generateAIContent}
                            className="h-7 text-[10px] gap-1 px-2 border border-primary/20 hover:bg-primary/10 transition-colors"
                          >
                            <Sparkles size={12} className="text-primary" /> Write with AI
                          </Button>
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            className="min-h-[300px] font-mono text-sm" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="flex justify-between items-center">
                          Image URL (Optional)
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={generateAIImage}
                            className="h-7 text-[10px] gap-1 px-2 border border-primary/20 hover:bg-primary/10 transition-colors"
                          >
                            <Sparkles size={12} className="text-primary" /> Generate with AI
                          </Button>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="https://unsplash.com/photos/..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reading_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reading Time (min)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="layout"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Layout</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="wide">Wide</SelectItem>
                            <SelectItem value="narrow">Narrow</SelectItem>
                            <SelectItem value="full">Full</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-4 pt-6">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate(`/article/${id}`)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="min-w-[150px]"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </Form>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EditArticle;
