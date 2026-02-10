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
import { Article, createArticle } from '@/data/articles';
import { slugify } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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

const CreateArticle = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const title = form.watch('title');

  useEffect(() => {
    if (title) {
      form.setValue('id', slugify(title), { shouldValidate: true });
    }
  }, [title, form]);

  async function onSubmit(values: z.infer<typeof articleSchema>) {
    setIsSubmitting(true);
    try {
      const articleData: Article = {
        ...values,
        id: values.id, // Ensure id is present
        image_url: values.image_url || undefined,
      } as Article;

      const result = await createArticle(articleData);
      
      if (result) {
        toast.success('Article created successfully!');
        navigate(`/article/${result.id}`);
      } else {
        toast.error('Failed to create article. Please check console.');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
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
            <h1 className="font-serif text-4xl mb-8">Create New Entry</h1>
            
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
                          <Input placeholder="The Hidden Rhythms of Thought" {...field} />
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
                          <Input placeholder="hidden-rhythms-of-thought" {...field} />
                        </FormControl>
                        <FormDescription>Used in the URL</FormDescription>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="psychology">{t('cat_psychology_analyses')}</SelectItem>
                            <SelectItem value="philosophy">{t('cat_philosophical_inquiries')}</SelectItem>
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
                            placeholder="A brief summary of the article..." 
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
                            placeholder="Use Markdown for formatting..." 
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a layout" />
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

                <div className="flex justify-end pt-6">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="min-w-[150px]"
                  >
                    {isSubmitting ? 'Creating...' : 'Publish Article'}
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

export default CreateArticle;
