// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
extern crate directories;
use directories::ProjectDirs;
use std::ffi::OsStr;
use std::fs;
use std::path::Path;
use std::path::PathBuf;

#[tauri::command]
fn get_all_sets() -> Result<String, String> {
    if let Some(proj_dirs) = ProjectDirs::from("org", "zendard", "TobyLearn") {
        let file_list = proj_dirs.config_dir().join("sets").read_dir().ok().unwrap();
        let file_list: Vec<PathBuf> = file_list
            .into_iter()
            .map(|file_name| file_name.map(|e| e.path()).unwrap())
            .collect();
        let filtered_list: Vec<PathBuf> = file_list
            .iter()
            .filter(|file| Path::extension(file.as_path()) == Some(OsStr::new("tl")))
            .map(|file| file.to_owned())
            .collect();
        let str_list: Vec<&str> = filtered_list
            .iter()
            .map(|file_path| Path::file_stem(file_path).unwrap().to_str().unwrap())
            .collect();
        Ok(str_list.join(","))
    } else {
        Err("Error while getting sets".to_string())
    }
}
#[tauri::command]
fn get_file_content(file: String) -> Result<String, String> {
    let file_content: String = fs::read(file)
        .unwrap()
        .iter()
        .map(|e| e.to_string())
        .collect();
    Ok(file_content)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_all_sets, get_file_content])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
