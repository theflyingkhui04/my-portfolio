<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Admin Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <div class="error" v-if="errorMessage">{{ errorMessage }}</div>
        <button type="submit" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../../utils/supabase';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';
  
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (error) {
    errorMessage.value = error.message;
  } else {
    router.push('/admin');
  }
  
  loading.value = false;
};
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--color-beige-400);
  color: var(--color-text-400);
}

.login-card {
  background-color: var(--color-beige-500);
  padding: 2.5rem;
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--color-beige-600);

  h2 {
    margin-top: 0;
    margin-bottom: 2rem;
    text-align: center;
    color: var(--color-orange-400);
  }
}

.form-group {
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--color-text-300);
    font-weight: bold;
  }

  input {
    width: 100%;
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
  }
}

.error {
  color: #ef4444;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

button {
  width: 100%;
  padding: 0.75rem;
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
    opacity: 0.7;
    cursor: not-allowed;
  }
}
</style>
