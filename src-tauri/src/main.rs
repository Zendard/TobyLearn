// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod get_project_dir;
use crate::get_project_dir::get_project_dir;

mod get_all_sets;
use crate::get_all_sets::get_all_sets;

mod get_file_content;
use crate::get_file_content::get_file_content;

mod save_settings;
use crate::save_settings::save_settings;

mod get_settings;
use crate::get_settings::get_settings;

mod save_set;
use crate::save_set::save_set;

mod delete_set;
use crate::delete_set::delete_set;

mod import_set;
use crate::import_set::import_set;

mod check_update;
use crate::check_update::check_update;

mod export_set;
use crate::export_set::export_set;

mod reverse_set;
use crate::reverse_set::reverse_set;

use std::fs;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let proj_dirs = match get_project_dir() {
                Err(e) => return Err(e.into()),
                Ok(data) => data,
            };
            let version_file_path = proj_dirs.config_dir().join("current.version");

            let current_version = app.package_info().version.to_string();

            match fs::write(&version_file_path, current_version) {
                Err(e) => return Err(e.into()),
                Ok(data) => data,
            };
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_all_sets,
            get_file_content,
            save_settings,
            get_settings,
            save_set,
            delete_set,
            import_set,
            check_update,
            export_set,
            reverse_set
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
