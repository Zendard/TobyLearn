// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
extern crate directories;
use directories::ProjectDirs;
use std::ffi::OsStr;
use std::path::PathBuf;
use std::{error::Error, fs, path::Path};

#[tauri::command]
fn get_all_sets() -> Result<String, String> {
    if let Some(proj_dirs) = ProjectDirs::from("org", "zendard", "TobyLearn") {
        let file_list = proj_dirs.config_dir().read_dir().ok().unwrap();
        let file_list: Vec<PathBuf> = file_list
            .into_iter()
            .map(|file_name| file_name.map(|e| e.path()).unwrap())
            .collect();
        let filtered_list = file_list
            .iter()
            .filter(|file| Path::extension(file.as_path()) == Some(OsStr::new("tl")));
        let str_list: Vec<&str> = file_list
            .iter()
            .map(|filePath| filePath.to_str().unwrap())
            .collect();
        Ok(str_list.concat())
    } else {
        Err("Error while getting sets".to_string())
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_all_sets])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
