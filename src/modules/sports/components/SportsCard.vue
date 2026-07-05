<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useSports } from "@/modules/sports/composables/useSports";

const { t } = useI18n();
const { favoriteTeam, lastMatch, loading, error, isStale } = useSports();
</script>

<template>
  <v-card :to="{ name: 'sports' }" class="pa-4" hover>
    <div class="d-flex align-center justify-space-between mb-2">
      <span class="text-subtitle-1 font-weight-medium">{{ t("home.sports") }}</span>
      <v-avatar v-if="favoriteTeam?.badgeUrl" :image="favoriteTeam.badgeUrl" size="24" />
      <v-icon v-else icon="mdi-soccer" />
    </div>

    <v-progress-circular v-if="loading" indeterminate size="24" />
    <p v-else-if="error" class="text-error text-body-2 mb-0">{{ error }}</p>
    <template v-else-if="favoriteTeam && lastMatch">
      <p class="text-caption text-medium-emphasis mb-0">{{ t("sports.lastMatch") }}</p>
      <p class="text-body-2 mb-0">{{ lastMatch.homeTeam }} {{ lastMatch.homeScore }} - {{ lastMatch.awayScore }} {{ lastMatch.awayTeam }}</p>
      <p v-if="isStale" class="text-caption text-warning mt-1 mb-0">{{ t("common.staleData") }}</p>
    </template>
    <p v-else class="text-body-2 text-medium-emphasis mb-0">{{ t("sports.noTeam") }}</p>
  </v-card>
</template>
