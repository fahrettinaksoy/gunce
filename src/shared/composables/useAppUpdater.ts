import { ref } from "vue";
import { check, type Update } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

export function useAppUpdater() {
  const checking = ref(false);
  const installing = ref(false);
  const available = ref(false);
  const version = ref<string | null>(null);
  const error = ref<string | null>(null);

  let pendingUpdate: Update | null = null;

  async function checkForUpdates() {
    checking.value = true;
    error.value = null;
    try {
      pendingUpdate = await check();
      available.value = !!pendingUpdate;
      version.value = pendingUpdate?.version ?? null;
    } catch (err) {
      // Mobil hedeflerde updater plugin'i kayıtlı değil; bu beklenen bir durum.
      error.value = err instanceof Error ? err.message : "Güncelleme kontrolü bu platformda desteklenmiyor";
    } finally {
      checking.value = false;
    }
  }

  async function installUpdate() {
    if (!pendingUpdate) return;
    installing.value = true;
    error.value = null;
    try {
      await pendingUpdate.downloadAndInstall();
      await relaunch();
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Güncelleme kurulamadı";
    } finally {
      installing.value = false;
    }
  }

  return { checking, installing, available, version, error, checkForUpdates, installUpdate };
}
