mod commands;

use commands::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .setup(|app| {
            // Configure window for macOS
            #[cfg(target_os = "macos")]
            {
                use tauri::Manager;
                if let Some(window) = app.get_webview_window("main") {
                    // Set the window to have a transparent title bar
                    let _ = window.set_title_bar_style(tauri::TitleBarStyle::Overlay);
                }
            }
            
            // Initialize app config on startup
            println!("Setting up app...");
            tauri::async_runtime::spawn(async move {
                println!("Initializing app config...");
                match commands::initialize_app_config().await {
                    Ok(()) => println!("App config initialized successfully"),
                    Err(e) => eprintln!("Failed to initialize app config: {}", e),
                }
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            read_config_file,
            write_config_file,
            list_config_files,
            check_app_config_exists,
            create_app_config_dir,
            backup_claude_configs,
            get_stores,
            get_store,
            create_store,
            update_store,
            delete_store,
            set_using_store,
            get_current_store
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
