<template>
  <div class="dashboard-layout">
    <div class="sidebar">
      <h2>Admin Panel</h2>
      <ul class="nav-list">
        <li 
          :class="{ active: currentTab === 'projects' }" 
          @click="currentTab = 'projects'"
        >
          Projects
        </li>
        <li 
          :class="{ active: currentTab === 'profile' }" 
          @click="currentTab = 'profile'"
        >
          Profile Settings
        </li>
      </ul>
      <div class="sidebar-footer">
        <button class="btn-logout" @click="handleLogout">Logout</button>
      </div>
    </div>
    
    <div class="main-content">
      <ProjectsTab v-if="currentTab === 'projects'" />
      <ProfileTab v-if="currentTab === 'profile'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../../utils/supabase';
import ProjectsTab from './ProjectsTab.vue';
import ProfileTab from './ProfileTab.vue';

const router = useRouter();
const currentTab = ref<'projects' | 'profile'>('projects');

const handleLogout = async () => {
  await supabase.auth.signOut();
  router.push('/admin/login');
};
</script>

<style scoped lang="scss">
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-beige-400);
  color: var(--color-text-400);
}

.sidebar {
  width: 250px;
  background-color: var(--color-beige-500);
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--color-beige-600);
  border-top-right-radius: var(--radius-xl);
  border-bottom-right-radius: var(--radius-xl);
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);

  h2 {
    padding: 0 1.5rem;
    margin-top: 0;
    margin-bottom: 2rem;
    font-size: 1.25rem;
    color: var(--color-orange-400);
  }
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;

  li {
    padding: 1rem 1.5rem;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
    font-weight: bold;
    color: var(--color-text-300);
    margin: 0 1rem;
    border-radius: var(--radius-md);
    margin-bottom: 0.5rem;

    &:hover {
      background-color: var(--color-beige-600);
      color: var(--color-text-400);
    }

    &.active {
      background-color: var(--color-orange-400);
      color: var(--color-white-400);
    }
  }
}

.sidebar-footer {
  padding: 1.5rem;
  
  .btn-logout {
    width: 100%;
    padding: 0.75rem;
    background-color: transparent;
    color: #ef4444;
    border: 1px solid #ef4444;
    border-radius: var(--radius-md);
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background-color: #ef4444;
      color: var(--color-white-400);
    }
  }
}

.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}
</style>
