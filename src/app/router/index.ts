import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/app/views/HomeView.vue"),
    },
    {
      path: "/namaz-vakitleri",
      name: "prayer-times",
      component: () => import("@/modules/prayer-times/components/PrayerTimesPage.vue"),
    },
    {
      path: "/hava-durumu",
      name: "weather",
      component: () => import("@/modules/weather/components/WeatherPage.vue"),
    },
    {
      path: "/doviz",
      name: "currency",
      component: () => import("@/modules/currency/components/CurrencyPage.vue"),
    },
    {
      path: "/spor",
      name: "sports",
      component: () => import("@/modules/sports/components/SportsPage.vue"),
    },
    {
      path: "/ayarlar",
      name: "settings",
      component: () => import("@/modules/settings/components/SettingsPage.vue"),
    },
  ],
});

export default router;
