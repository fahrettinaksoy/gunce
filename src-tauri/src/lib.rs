#[cfg(desktop)]
fn setup_tray(app: &tauri::App) -> tauri::Result<()> {
    use tauri::{
        menu::{Menu, MenuItem},
        tray::TrayIconBuilder,
        Manager,
    };

    let show_item = MenuItem::with_id(app, "show", "Göster", true, None::<&str>)?;
    let quit_item = MenuItem::with_id(app, "quit", "Çıkış", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&show_item, &quit_item])?;

    TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .show_menu_on_left_click(true)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "quit" => app.exit(0),
            "show" => {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
            _ => {}
        })
        .build(app)?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_notification::init())
        .setup(|app| {
            #[cfg(desktop)]
            setup_tray(app)?;
            Ok(())
        });

    // Otomatik güncelleme ve sistem tepsisi: App Store/Play Store kendi güncelleme
    // mekanizmalarını kullandığından ve mobilde "tray" kavramı olmadığından bu
    // davranışlar sadece masaüstü (Windows/macOS/Linux) hedeflerinde etkin.
    // Pencere kapatılınca uygulamayı tamamen sonlandırmak yerine tepsiye küçültüyoruz;
    // çıkış tepsi menüsündeki "Çıkış" ile yapılır.
    #[cfg(desktop)]
    {
        builder = builder
            .plugin(tauri_plugin_updater::Builder::new().build())
            .plugin(tauri_plugin_process::init())
            .on_window_event(|window, event| {
                if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                    window.hide().ok();
                    api.prevent_close();
                }
            });
    }

    builder
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
