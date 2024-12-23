// #![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::{Manager};
// Prevents additional console window on Windows in release, DO NOT REMOVE!!

fn main() {
    tauri::Builder::default()
      .setup(|app| {
        let splashscreen_window = app.get_window("splashscreen").unwrap();
        let main_window = app.get_window("main").unwrap();
        // we perform the initialization code on a new task so the app doesn't freeze
        tauri::async_runtime::spawn(async move {
          // initialize your app here instead of sleeping :)
          std::thread::sleep(std::time::Duration::from_secs(3));
          // After it's done, close the splashscreen and display the main window
          splashscreen_window.close().unwrap();
          main_window.show().unwrap();
          main_window.set_fullscreen(true).unwrap();
        });
        Ok(())
      })
      .run(tauri::generate_context!())
      .expect("failed to run app");
  }
