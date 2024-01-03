// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
extern crate directories;
use std::fs
use directories::{ProjectDirs};
const CONFIG_FOLDER=if let Some(proj_dirs) = ProjectDirs::from("com", "Foo Corp",  "Bar App") {
    proj_dirs.config_dir();
}

#[tauri::command]
fn get_all_sets() -> String {
}

fn main() {
  tauri::Builder::default()
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
