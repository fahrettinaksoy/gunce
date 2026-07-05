<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useSports } from "@/modules/sports/composables/useSports";

const { t } = useI18n();
const { favoriteTeam, loading, selectTeam } = useSports();
const teamInput = ref(favoriteTeam.value?.name ?? "");

function search() {
  const name = teamInput.value.trim();
  if (name) selectTeam(name);
}
</script>

<template>
  <v-card variant="tonal" class="pa-4">
    <div class="d-flex ga-2">
      <v-text-field
        v-model="teamInput"
        :label="t('sports.teamPlaceholder')"
        density="comfortable"
        hide-details
        @keyup.enter="search"
      />
      <v-btn color="primary" :loading="loading" @click="search">{{ t("sports.search") }}</v-btn>
    </div>
  </v-card>
</template>
