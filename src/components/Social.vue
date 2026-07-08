<script setup lang="ts">
import { computed, onMounted } from "vue";
import Github from "./icons/Github.vue";
import Linkedin from "./icons/Linkedin.vue";
import Instagram from "./icons/Instagram.vue";
import Mail from "./icons/Mail.vue";
import X from "./icons/X.vue";
import Link from "./Link.vue";
import { t } from "../i18n/utils/translate";
import ButtonRound from "./ButtonRound.vue";

import { social as defaultSocial } from "../content/social";
import { useSupabaseProfile } from "../composables/useSupabaseProfile";

const props = defineProps<{
  variant?: "theme" | "background";
}>();

const { profile, fetchProfile } = useSupabaseProfile();

onMounted(() => {
  fetchProfile();
});

const socialLinks = computed(() => {
  if (profile.value && profile.value.social_links && profile.value.social_links.length > 0) {
    return profile.value.social_links;
  }
  return defaultSocial;
});

import type { Component } from "vue";

// map icon names to components
const icons: Record<string, Component> = {
  mail: Mail,
  github: Github,
  linkedin: Linkedin,
  x: X,
  instagram: Instagram,
};

const getAriaLabel = (name: string) => `${t("go-to")} ${name.charAt(0).toUpperCase() + name.slice(1)}`;
</script>

<template>
  <div class="social">
    <Link
      v-for="item in socialLinks"
      :key="item.name"
      external
      :href="item.url"
      :aria-label="getAriaLabel(item.name)"
      class="social-link"
      data-cursor="circle-white"
    >
      <ButtonRound
        renderAs="div"
        :variant="props.variant ?? 'theme'"
        class="children-unclickable"
        data-hoversound="hover"
      >
        <component :is="icons[item.name]" :aria-label="getAriaLabel(item.name)" external />
      </ButtonRound>
    </Link>
  </div>
</template>

<style scoped lang="scss">
.social {
  display: flex;
  gap: var(--space-md);
}
</style>
