import { createApp } from "vue";
import App from "./App.vue";
import router from "@/app/router";
import { pinia } from "@/app/plugins/pinia";
import { vuetify } from "@/app/plugins/vuetify";
import { i18n } from "@/app/plugins/i18n";

createApp(App).use(pinia).use(router).use(vuetify).use(i18n).mount("#app");
