<template>
  <div class="projects-tab">
    <div class="header">
      <h1>Projects Dashboard</h1>
      <button v-if="!showEditor" class="btn-primary" @click="addProject">Add Project</button>
    </div>
    
    <div v-if="showEditor" class="editor-container">
      <Editor :initial-data="editingProject" @cancel="closeEditor" @saved="onSaved" />
    </div>

    <div v-else class="content">
      <div v-if="loading" class="loading">Loading projects...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="projects.length === 0" class="empty">No projects found. Create one!</div>
      <div v-else class="project-list">
        <div v-for="project in projects" :key="project.id" class="project-card">
          <div class="project-info">
            <h3>{{ project.title }}</h3>
            <span class="slug">{{ project.slug }} - {{ project.locale }}</span>
          </div>
          <div class="project-actions">
            <button class="btn-edit" @click="editProject(project)">Edit</button>
            <button class="btn-delete" @click="handleDelete(project.slug, project.locale)">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSupabaseProjects } from '../../composables/useSupabaseProjects';
import Editor from './Editor.vue';

const { projects, loading, error, fetchProjects, deleteProject } = useSupabaseProjects();

const showEditor = ref(false);
const editingProject = ref<any>(null);

onMounted(() => {
  fetchProjects('en');
});

const addProject = () => {
  editingProject.value = null;
  showEditor.value = true;
};

const editProject = (project: any) => {
  editingProject.value = project;
  showEditor.value = true;
};

const closeEditor = () => {
  showEditor.value = false;
  editingProject.value = null;
};

const onSaved = () => {
  closeEditor();
  fetchProjects('en');
};

const handleDelete = async (slug: string, locale: string) => {
  if (confirm(`Are you sure you want to delete ${slug}?`)) {
    await deleteProject(slug, locale as any);
  }
};
</script>

<style scoped lang="scss">
.projects-tab {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    h1 {
      font-size: 2rem;
      color: var(--color-text-400);
      margin: 0;
    }
  }
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background-color: var(--color-orange-400);
  color: var(--color-white-400);
  border: none;
  border-radius: var(--radius-md);
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
}

.content {
  background-color: var(--color-beige-500);
  padding: 2rem;
  border-radius: var(--radius-xl);
  color: var(--color-text-400);
  box-shadow: 0 10px 30px rgba(0,0,0,0.02);
}

.project-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.project-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-white-400);
  padding: 1.5rem;
  border-radius: var(--radius-md);
  box-shadow: 0 4px 15px rgba(0,0,0,0.02);
  border: 1px solid var(--color-beige-600);

  h3 {
    margin: 0 0 0.5rem 0;
    color: var(--color-text-400);
  }

  .slug {
    font-size: 0.85rem;
    color: var(--color-text-300);
  }
}

.project-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit, .btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: bold;
}

.btn-edit {
  background-color: var(--color-dark-blue-600);
  color: var(--color-white-400);
  &:hover { opacity: 0.9; }
}

.btn-delete {
  background-color: #ef4444;
  color: #fff;
  &:hover { background-color: #dc2626; }
}
</style>
