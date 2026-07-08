<template>
  <div class="editor">
    <div class="header">
      <h2>{{ isEditing ? 'Edit Project' : 'New Project' }}</h2>
      <div class="actions">
        <button type="button" class="btn-secondary" @click="$emit('cancel')">Cancel</button>
        <button type="button" class="btn-primary" @click="save" :disabled="loading">
          {{ loading ? 'Saving...' : 'Save Project' }}
        </button>
      </div>
    </div>
    
    <div class="error" v-if="error">{{ error }}</div>

    <form class="form-grid" @submit.prevent="save">
      <div class="form-group">
        <label>Slug (URL ID)</label>
        <input type="text" v-model="form.slug" required :disabled="isEditing" placeholder="e.g. cubewar" />
      </div>
      
      <div class="form-group">
        <label>Title</label>
        <input type="text" v-model="form.title" required />
      </div>
      
      <div class="form-group">
        <label>Language Locale</label>
        <select v-model="form.locale" :disabled="isEditing">
          <option value="en">English</option>
          <option value="vi">Vietnamese</option>
        </select>
      </div>

      <div class="form-group">
        <label>Theme</label>
        <select v-model="form.theme">
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </div>

      <div class="form-group">
        <label>Tags (Comma separated)</label>
        <input type="text" v-model="tagsInput" placeholder="three, node, websockets" />
      </div>

      <div class="form-group">
        <label>Live URL (optional)</label>
        <input type="text" v-model="form.live" />
      </div>

      <div class="form-group full-width">
        <label>Description (HTML allowed)</label>
        <textarea v-model="form.description" rows="5"></textarea>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useSupabaseProjects } from '../../composables/useSupabaseProjects';

const props = defineProps<{
  initialData?: any;
}>();

const emit = defineEmits(['cancel', 'saved']);

const { saveProject, loading, error } = useSupabaseProjects();

const form = ref({
  slug: '',
  title: '',
  locale: 'en',
  theme: 'dark',
  tags: [] as string[],
  live: '',
  description: '',
  components: [],
  thumbnail: ''
});

const tagsInput = ref('');

const isEditing = computed(() => !!props.initialData);

watch(() => props.initialData, (newVal) => {
  if (newVal) {
    form.value = { ...newVal };
    tagsInput.value = newVal.tags ? newVal.tags.join(', ') : '';
  }
}, { immediate: true });

const save = async () => {
  // Parse tags
  form.value.tags = tagsInput.value.split(',').map(t => t.trim()).filter(Boolean);
  
  try {
    await saveProject(form.value);
    emit('saved');
  } catch (err) {
    console.error(err);
  }
};
</script>

<style scoped lang="scss">
.editor {
  background: var(--color-beige-500);
  padding: 2rem;
  border-radius: var(--radius-xl);
  color: var(--color-text-400);
  box-shadow: 0 10px 30px rgba(0,0,0,0.02);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h2 { margin: 0; color: var(--color-text-400); }
}

.actions {
  display: flex;
  gap: 1rem;
}

.btn-primary, .btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--radius-md);
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-primary {
  background-color: var(--color-orange-400);
  color: var(--color-white-400);
  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.7; }
}
.btn-secondary {
  background-color: var(--color-dark-blue-600);
  color: var(--color-white-400);
  &:hover { opacity: 0.9; }
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    color: var(--color-text-300);
    font-size: 0.9rem;
    font-weight: bold;
  }

  input, select, textarea {
    padding: 0.75rem;
    background-color: var(--color-white-400);
    border: 1px solid var(--color-beige-600);
    color: var(--color-text-400);
    border-radius: var(--radius-md);
    font-family: inherit;
    
    &:focus {
      outline: none;
      border-color: var(--color-orange-400);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &.full-width {
    grid-column: 1 / -1;
  }
}

.error {
  color: #ef4444;
  margin-bottom: 1rem;
}
</style>
