<template>
  <div class="admin-wrapper">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// Layout is handled directly by Dashboard.vue for now
</script>

<style scoped>
.admin-wrapper {
  min-height: 100vh;
  background-color: var(--color-beige-400);
}
</style>
