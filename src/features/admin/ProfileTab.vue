<template>
  <div class="profile-tab">
    <div class="header">
      <h1>Profile Settings</h1>
    </div>
    
    <div v-if="loading && !profile" class="loading">Loading profile data...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else-if="profile" class="content">
      <form @submit.prevent="saveProfile" class="profile-form">
        <div class="form-group">
          <label>About Tagline (English)</label>
          <textarea v-model="form.about_tagline_en" required></textarea>
        </div>
        
        <div class="form-group">
          <label>About Tagline (Vietnamese)</label>
          <textarea v-model="form.about_tagline_vi" required></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Location (English)</label>
            <input v-model="form.location_en" required />
          </div>
          <div class="form-group">
            <label>Location (Vietnamese)</label>
            <input v-model="form.location_vi" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Contact Title (English)</label>
            <input v-model="form.contact_title_en" required />
          </div>
          <div class="form-group">
            <label>Contact Title (Vietnamese)</label>
            <input v-model="form.contact_title_vi" required />
          </div>
        </div>
        
        <div class="form-group">
          <label>Skills (Comma separated)</label>
          <input type="text" v-model="skillsInput" placeholder="WebGL, Vue, Node.js" />
        </div>

        <div class="social-section">
          <h3>Social Links</h3>
          <div v-for="(link, index) in form.social_links" :key="index" class="social-link-row">
            <select v-model="link.name">
              <option value="mail">Email</option>
              <option value="github">GitHub</option>
              <option value="linkedin">LinkedIn</option>
              <option value="x">X (Twitter)</option>
              <option value="instagram">Instagram</option>
            </select>
            <input type="url" v-model="link.url" placeholder="https://..." required />
            <button type="button" class="btn-remove" @click="removeSocial(index)">Remove</button>
          </div>
          <button type="button" class="btn-secondary" @click="addSocial">Add Link</button>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useSupabaseProfile, type ProfileData } from '../../composables/useSupabaseProfile';

const { profile, loading, error, fetchProfile, updateProfile } = useSupabaseProfile();

const form = reactive<Omit<ProfileData, 'id'>>({
  about_tagline_en: '',
  about_tagline_vi: '',
  location_en: '',
  location_vi: '',
  contact_title_en: '',
  contact_title_vi: '',
  social_links: [],
  skills: []
});

const skillsInput = ref('');

onMounted(async () => {
  await fetchProfile();
  if (profile.value) {
    Object.assign(form, {
      about_tagline_en: profile.value.about_tagline_en,
      about_tagline_vi: profile.value.about_tagline_vi,
      location_en: profile.value.location_en,
      location_vi: profile.value.location_vi,
      contact_title_en: profile.value.contact_title_en,
      contact_title_vi: profile.value.contact_title_vi,
      social_links: JSON.parse(JSON.stringify(profile.value.social_links || [])),
      skills: JSON.parse(JSON.stringify(profile.value.skills || []))
    });
    skillsInput.value = form.skills.join(', ');
  }
});

const addSocial = () => {
  form.social_links.push({ name: 'github', url: '' });
};

const removeSocial = (index: number) => {
  form.social_links.splice(index, 1);
};

const saveProfile = async () => {
  form.skills = skillsInput.value.split(',').map(s => s.trim()).filter(Boolean);
  await updateProfile(form);
  if (!error.value) {
    alert('Profile saved successfully!');
  }
};
</script>

<style scoped lang="scss">
.profile-tab {
  .header {
    margin-bottom: 2rem;
    h1 {
      font-size: 2rem;
      color: var(--color-text-400);
      margin: 0;
    }
  }
}

.content {
  background-color: var(--color-beige-500);
  padding: 2rem;
  border-radius: var(--radius-xl);
  color: var(--color-text-400);
  box-shadow: 0 10px 30px rgba(0,0,0,0.02);
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  .form-group {
    flex: 1;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.9rem;
    color: var(--color-text-300);
    font-weight: bold;
  }

  input, textarea, select {
    padding: 0.75rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--color-beige-600);
    background-color: var(--color-white-400);
    color: var(--color-text-400);
    font-family: inherit;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: var(--color-orange-400);
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }
}

.social-section {
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-beige-600);

  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: var(--color-text-400);
  }
}

.social-link-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;

  select {
    width: 150px;
  }
  
  input {
    flex: 1;
  }
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background-color: var(--color-orange-400);
  color: var(--color-white-400);
  border: none;
  border-radius: var(--radius-md);
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.btn-secondary {
  padding: 0.5rem 1rem;
  background-color: var(--color-dark-blue-600);
  color: var(--color-white-400);
  border: none;
  border-radius: var(--radius-sm);
  font-weight: bold;
  cursor: pointer;
  
  &:hover { opacity: 0.9; }
}

.btn-remove {
  padding: 0.5rem 1rem;
  background-color: #ef4444;
  color: var(--color-white-400);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: bold;
  
  &:hover { background-color: #dc2626; }
}

.form-actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
}
</style>
