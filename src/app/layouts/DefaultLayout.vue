<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useNetworkStatus } from "@/shared/composables/useNetworkStatus";

const { mobile } = useDisplay();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const { isOnline } = useNetworkStatus();

const items = computed(() => [
  { title: t("nav.home"), icon: "mdi-home", to: "/" },
  { title: t("nav.prayerTimes"), icon: "mdi-mosque", to: "/namaz-vakitleri" },
  { title: t("nav.weather"), icon: "mdi-weather-partly-cloudy", to: "/hava-durumu" },
  { title: t("nav.currency"), icon: "mdi-currency-try", to: "/doviz" },
  { title: t("nav.sports"), icon: "mdi-soccer", to: "/spor" },
  { title: t("nav.settings"), icon: "mdi-cog", to: "/ayarlar" },
]);

const activeIndex = computed(() => items.value.findIndex((item) => item.to === route.path));

function navigate(to: string) {
  router.push(to);
}
</script>

<template>
  <v-app>
    <v-navigation-drawer v-if="!mobile" permanent>
      <v-list>
        <v-list-item
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
        />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar v-if="mobile" density="comfortable">
      <v-app-bar-title>{{ t("app.name") }}</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-alert
        v-if="!isOnline"
        type="warning"
        variant="tonal"
        density="comfortable"
        rounded="0"
        class="text-center"
      >
        {{ t("common.offline") }}
      </v-alert>
      <router-view />
    </v-main>

    <v-bottom-navigation v-if="mobile" :model-value="activeIndex" grow>
      <v-btn v-for="item in items" :key="item.to" :title="item.title" @click="navigate(item.to)">
        <v-icon :icon="item.icon" />
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>
