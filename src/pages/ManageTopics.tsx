import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
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
import {
  createTopic,
  deleteTopic,
  fetchTopics,
  Topic,
  updateTopic
} from '@/data/topics';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Edit2, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import * as z from 'zod';

const topicSchema = z.object({
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  theme_color: z.string().default('slate'),
  cover_image: z.string().optional().nullable(),
});

type TopicFormValues = z.infer<typeof topicSchema>;

const ManageTopics = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: topics = [], isLoading } = useQuery({
    queryKey: ['topics'],
    queryFn: fetchTopics,
  });

  const form = useForm<TopicFormValues>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      slug: '',
      title: '',
      description: '',
      theme_color: 'slate',
      cover_image: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: createTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast.success(t('topic_created_successfully'));
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Topic> }) => updateTopic(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast.success(t('topic_updated_successfully'));
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast.success(t('topic_deleted_successfully'));
    },
  });

  const onSubmit = (data: TopicFormValues) => {
    if (editingTopic) {
      updateMutation.mutate({ id: editingTopic.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const resetForm = () => {
    form.reset({
      slug: '',
      title: '',
      description: '',
      theme_color: 'slate',
      cover_image: '',
    });
    setEditingTopic(null);
    setIsFormOpen(false);
  };

  const handleEdit = (topic: Topic) => {
    setEditingTopic(topic);
    form.reset({
        slug: topic.slug,
        title: topic.title,
        description: topic.description,
        theme_color: topic.theme_color || 'slate',
        cover_image: topic.cover_image || '',
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this topic? Articles assigned to it will remain but won't show under this dossier.")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="p-20 text-center font-serif italic">{t('loading_topics')}</div>;

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <div className="flex justify-between items-end mb-12 border-b border-border/40 pb-6">
          <div>
            <h1 className="font-title text-4xl mb-2">{t('manage_dossiers')}</h1>
            <p className="text-muted-foreground font-serif italic">{t('curate_dossiers')}</p>
          </div>
          <Button 
            onClick={() => setIsFormOpen(true)}
            className="rounded-none font-ui tracking-widest uppercase text-[10px]"
          >
            <Plus size={14} className="mr-2" /> {t('new_dossier')}
          </Button>
        </div>

        {isFormOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 p-8 bg-card border border-border/60 relative shadow-2xl"
          >
            <button 
                onClick={resetForm}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
                <X size={20} />
            </button>
            <h2 className="font-title text-2xl mb-8 uppercase tracking-widest">
              {editingTopic ? t('edit_dossier') : t('create_dossier')}
            </h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="ui-label">{t('dossier_title')}</FormLabel>
                        <FormControl>
                            <Input placeholder="..." {...field} className="bg-background rounded-none" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="ui-label">{t('dossier_slug')}</FormLabel>
                        <FormControl>
                            <Input placeholder="..." {...field} className="bg-background rounded-none" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="ui-label">{t('dossier_description')}</FormLabel>
                      <FormControl>
                        <Textarea 
                            placeholder="..." 
                            {...field} 
                            rows={3} 
                            className="bg-background rounded-none font-serif text-lg italic"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                    control={form.control}
                    name="theme_color"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="ui-label">{t('theme_color')}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || 'slate'}>
                            <FormControl>
                                <SelectTrigger className="bg-background rounded-none">
                                    <SelectValue placeholder="..." />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-none font-ui uppercase tracking-widest text-[10px]">
                                <SelectItem value="rose">Rose (Editorial Red)</SelectItem>
                                <SelectItem value="emerald">Emerald (Nature Green)</SelectItem>
                                <SelectItem value="blue">Blue (Tech/Science)</SelectItem>
                                <SelectItem value="slate">Slate (Classic Gray)</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="cover_image"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="ui-label">{t('cover_image_url')}</FormLabel>
                        <FormControl>
                            <div className="space-y-4">
                                <Input placeholder="https://..." {...field} value={field.value || ''} className="bg-background rounded-none" />
                                {field.value && (
                                    <div className="aspect-[21/9] w-full relative overflow-hidden border border-border/40">
                                        <img 
                                            src={field.value} 
                                            alt="Preview" 
                                            className="w-full h-full object-cover grayscale-[0.5] hover:grayscale-0 transition-all duration-700"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black/20" />
                                    </div>
                                )}
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={resetForm} className="rounded-none">
                    {t('cancel')}
                  </Button>
                  <Button 
                    type="submit" 
                    className="rounded-none min-w-[120px]"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {(createMutation.isPending || updateMutation.isPending) ? t('saving') : (editingTopic ? t('update') : t('create'))}
                  </Button>
                </div>
              </form>
            </Form>
          </motion.div>
        )}

        <div className="space-y-4">
          {topics.map((topic) => {
            const colorMap: Record<string, string> = {
              rose: '#f43f5e', // rose-500
              emerald: '#10b981', // emerald-500
              blue: '#3b82f6', // blue-500
              slate: '#64748b', // slate-500
            };
            const borderColor = colorMap[topic.theme_color || 'slate'];

            return (
              <div 
                  key={topic.id} 
                  className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-white dark:bg-zinc-950 border border-border/40 hover:border-border transition-colors border-l-4"
                  style={{ borderLeftColor: borderColor }}
              >
              <div className="flex flex-col md:flex-row gap-6 items-center flex-1">
                 {topic.cover_image && (
                   <div className="w-24 h-16 shrink-0 overflow-hidden border border-border/30">
                      <img src={topic.cover_image} alt="" className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                   </div>
                 )}
                 <div className="max-w-xl">
                    <div className="flex items-center gap-3 mb-1">
                       <h3 className="font-title text-xl uppercase tracking-wider">{topic.title}</h3>
                       <span className="text-[10px] font-ui px-2 py-0.5 bg-muted text-muted-foreground uppercase">{topic.slug}</span>
                    </div>
                    <p className="text-sm text-muted-foreground font-serif italic line-clamp-1">{topic.description}</p>
                 </div>
              </div>
              
              <div className="flex items-center gap-3 mt-4 md:mt-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleEdit(topic)}
                    className="hover:text-primary"
                >
                  <Edit2 size={16} />
                </Button>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(topic.id)}
                    className="hover:text-destructive"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
            );
          })}

          {topics.length === 0 && (
              <div className="py-20 text-center border border-dashed border-border rounded-lg">
                  <p className="text-muted-foreground font-serif italic">{t('no_dossiers_found')}</p>
              </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ManageTopics;
