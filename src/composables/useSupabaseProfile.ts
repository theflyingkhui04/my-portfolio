import { ref } from 'vue';
import { supabase } from '../utils/supabase';

export interface ProfileData {
  id: number;
  about_tagline_en: string;
  about_tagline_vi: string;
  location_en: string;
  location_vi: string;
  contact_title_en: string;
  contact_title_vi: string;
  social_links: { url: string; name: string }[];
  skills: string[];
}

const profile = ref<ProfileData | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
let initialized = false;

export function useSupabaseProfile() {
  const fetchProfile = async (force = false) => {
    if (initialized && !force) return profile.value;
    
    loading.value = true;
    error.value = null;
    try {
      const { data, error: err } = await supabase
        .from('profile')
        .select('*')
        .eq('id', 1)
        .single();

      if (err) throw err;
      profile.value = data;
      initialized = true;
      return data;
    } catch (err: any) {
      error.value = err.message;
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateProfile = async (updates: Partial<ProfileData>) => {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: err } = await supabase
        .from('profile')
        .update(updates)
        .eq('id', 1)
        .select()
        .single();

      if (err) throw err;
      profile.value = data;
      return data;
    } catch (err: any) {
      error.value = err.message;
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
  };
}
