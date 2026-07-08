import { ref } from 'vue';
import { supabase } from '../utils/supabase';
import type { ProjectContent } from '../content/types';

export function useSupabaseProjects() {
  const projects = ref<any[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchProjects = async (locale: 'en' | 'de' = 'en') => {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: err } = await supabase
        .from('projects')
        .select('*')
        .eq('locale', locale)
        .order('created_at', { ascending: false });

      if (err) throw err;
      projects.value = data || [];
    } catch (err: any) {
      error.value = err.message;
      console.error('Error fetching projects:', err);
    } finally {
      loading.value = false;
    }
  };

  const fetchProjectBySlug = async (slug: string, locale: 'en' | 'de' = 'en') => {
    loading.value = true;
    try {
      const { data, error: err } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .eq('locale', locale)
        .single();
      
      if (err) throw err;
      return data;
    } catch (err: any) {
      console.error('Error fetching project:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const uploadMedia = async (file: File, slug: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${slug}/${Math.random().toString(36).substring(2)}.${fileExt}`;
    const { data, error: err } = await supabase.storage
      .from('portfolio-media')
      .upload(fileName, file);

    if (err) throw err;
    
    const { data: { publicUrl } } = supabase.storage
      .from('portfolio-media')
      .getPublicUrl(fileName);
      
    return publicUrl;
  };

  const saveProject = async (projectData: any) => {
    loading.value = true;
    error.value = null;
    try {
      const { error: err } = await supabase
        .from('projects')
        .upsert({
          ...projectData,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'slug,locale' });

      if (err) throw err;
      await fetchProjects(projectData.locale || 'en');
    } catch (err: any) {
      error.value = err.message;
      console.error('Error saving project:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteProject = async (slug: string, locale: 'en' | 'de' = 'en') => {
    loading.value = true;
    try {
      const { error: err } = await supabase
        .from('projects')
        .delete()
        .eq('slug', slug)
        .eq('locale', locale);

      if (err) throw err;
      await fetchProjects(locale);
    } catch (err: any) {
      console.error('Error deleting project:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    projects,
    loading,
    error,
    fetchProjects,
    fetchProjectBySlug,
    saveProject,
    deleteProject,
    uploadMedia
  };
}
