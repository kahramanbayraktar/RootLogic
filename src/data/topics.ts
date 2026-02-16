import { supabase } from '@/lib/supabase';

export interface Topic {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover_image?: string | null;
  theme_color?: string | null;
  created_at?: string;
}

export async function fetchTopics(): Promise<Topic[]> {
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching topics:', error);
    return [];
  }

  return data as Topic[];
}

export async function createTopic(topic: Partial<Topic>): Promise<Topic | null> {
  const { data, error } = await supabase
    .from('topics')
    .insert([topic])
    .select()
    .single();

  if (error) {
    console.error('Error creating topic:', error);
    return null;
  }

  return data as Topic;
}

export async function updateTopic(id: string, topic: Partial<Topic>): Promise<Topic | null> {
  const { data, error } = await supabase
    .from('topics')
    .update(topic)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating topic:', error);
    return null;
  }

  return data as Topic;
}

export async function deleteTopic(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('topics')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting topic:', error);
    return false;
  }

  return true;
}
