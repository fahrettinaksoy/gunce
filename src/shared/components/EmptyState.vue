<script setup lang="ts">
defineProps<{ message: string; icon?: string }>();
</script>

<template>
  <div class="d-flex flex-column align-center justify-center text-center py-12 text-medium-emphasis">
    <v-icon :icon="icon ?? 'mdi-information-outline'" size="48" class="mb-3" />
    <p class="text-body-1">{{ message }}</p>
  </div>
</template>
