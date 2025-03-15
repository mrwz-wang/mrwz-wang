<template>
  <nav class="breadcrumb mb-6" aria-label="面包屑导航">
    <ol class="flex items-center flex-wrap">
      <li class="flex items-center">
        <NuxtLink to="/" class="hover:underline" style="color: var(--primary-color);">首页</NuxtLink>
        <span class="mx-2" style="color: var(--text-color); opacity: 0.5;">/</span>
      </li>
      <li 
        v-for="(crumb, index) in crumbs" 
        :key="index" 
        class="flex items-center"
      >
        <template v-if="index === crumbs.length - 1">
          <span style="color: var(--text-color);">{{ crumb.text }}</span>
        </template>
        <template v-else>
          <NuxtLink :to="crumb.path" class="hover:underline" style="color: var(--primary-color);">
            {{ crumb.text }}
          </NuxtLink>
          <span class="mx-2" style="color: var(--text-color); opacity: 0.5;">/</span>
        </template>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  crumbs: Array<{
    text: string;
    path: string;
  }>;
}>();
</script> 