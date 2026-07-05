<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useSports } from "@/modules/sports/composables/useSports";
import TeamPicker from "./TeamPicker.vue";
import EmptyState from "@/shared/components/EmptyState.vue";

const { t } = useI18n();
const { favoriteTeam, lastMatch, nextMatch, loading, error, isStale, refresh } = useSports();
</script>

<template>
  <v-container class="py-6" style="max-width: 640px">
    <h1 class="text-h5 mb-4">{{ t("sports.title") }}</h1>

    <TeamPicker class="mb-6" />

    <EmptyState v-if="!favoriteTeam" :message="t('sports.noTeam')" icon="mdi-soccer-field" />

    <template v-else>
      <v-alert v-if="isStale && !loading" type="warning" variant="tonal" class="mb-4" density="comfortable">
        {{ t("common.staleData") }}
      </v-alert>

      <v-progress-linear v-if="loading" indeterminate class="mb-4" />
      <v-alert v-if="error" type="error" variant="tonal" class="mb-4">{{ error }}</v-alert>

      <v-card variant="tonal" class="pa-4 mb-4">
        <div class="d-flex align-center ga-3 mb-2">
          <v-avatar v-if="favoriteTeam.badgeUrl" :image="favoriteTeam.badgeUrl" size="32" />
          <span class="text-h6">{{ favoriteTeam.name }}</span>
        </div>
      </v-card>

      <v-card class="pa-4 mb-4">
        <p class="text-caption text-medium-emphasis mb-1">{{ t("sports.lastMatch") }}</p>
        <template v-if="lastMatch">
          <p class="text-body-1 mb-0">
            {{ lastMatch.homeTeam }} {{ lastMatch.homeScore }} - {{ lastMatch.awayScore }} {{ lastMatch.awayTeam }}
          </p>
          <p class="text-caption text-medium-emphasis mb-0">{{ lastMatch.date }}</p>
        </template>
        <p v-else class="text-body-2 text-medium-emphasis mb-0">{{ t("sports.noData") }}</p>
      </v-card>

      <v-card class="pa-4">
        <p class="text-caption text-medium-emphasis mb-1">{{ t("sports.nextMatch") }}</p>
        <template v-if="nextMatch">
          <p class="text-body-1 mb-0">{{ nextMatch.homeTeam }} - {{ nextMatch.awayTeam }}</p>
          <p class="text-caption text-medium-emphasis mb-0">{{ nextMatch.date }} {{ nextMatch.time }}</p>
        </template>
        <p v-else class="text-body-2 text-medium-emphasis mb-0">{{ t("sports.noData") }}</p>
      </v-card>

      <v-btn class="mt-4" variant="tonal" prepend-icon="mdi-refresh" @click="refresh">
        {{ t("common.refresh") }}
      </v-btn>
    </template>
  </v-container>
</template>
