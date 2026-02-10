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
import { Article, deleteArticle, fetchArticleById, updateArticle } from '@/data/articles';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import * as z from 'zod';

const articleSchema = z.object({
  id: z.string().min(3, 'Slug must be at least 3 characters'),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  teaser: z.string().min(10, 'Teaser must be at least 10 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  category: z.enum(['psychology', 'philosophy', 'health']),
  date: z.string(),
  reading_time: z.coerce.number().min(1),
  author: z.string().min(2),
  image_url: z.string().url().optional().or(z.literal('')),
  layout: z.enum(['wide', 'narrow', 'full']).default('wide'),
});

const EditArticle = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
      teaser: '',
      content: '',
      category: 'psychology',
      date: new Date().toISOString().split('T')[0],
      reading_time: 5,
      author: 'The Root Logic',
      image_url: '',
      layout: 'wide',
    },
  });

  useEffect(() => {
    if (article) {
      form.reset({
        id: article.id,
        title: article.title,
        teaser: article.teaser,
        content: article.content,
        category: article.category,
        date: article.date,
        reading_time: article.reading_time,
        author: article.author,
        image_url: article.image_url || '',
        layout: article.layout || 'wide',
      });
    }
  }, [article, form]);

  async function onSubmit(values: z.infer<typeof articleSchema>) {
    if (!id) return;
    setIsSubmitting(true);
    try {
      const articleData: Partial<Article> = {
        title: values.title,
        teaser: values.teaser,
        content: values.content,
        category: values.category,
        date: values.date,
        reading_time: values.reading_time,
        author: values.author,
        image_url: values.image_url || undefined,
        layout: values.layout,
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
        <div className="animate-pulse font-serif text-2xl italic">Retrieving the manuscript...</div>
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
                            <SelectItem value="psychology">{t('cat_psychology')}</SelectItem>
                            <SelectItem value="philosophy">{t('cat_philosophy')}</SelectItem>
                            <SelectItem value="health">{t('cat_health')}</SelectItem>
                          </SelectContent>
                        </Select>
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
                    name="content"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Content (Markdown)</FormLabel>
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
                        <FormLabel>Image URL (Optional)</FormLabel>
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
