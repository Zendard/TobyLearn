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
    let proj_dirs = ProjectDirs::from("org", "zendard", "TobyLearn");
    if proj_dirs.is_none() {
        return Err("Project directory not found".to_string());
    }

    let files: Vec<PathBuf> = proj_dirs
        .unwrap()
        .config_dir()
        .join("sets")
        .read_dir()
        .ok()
        .unwrap()
        .into_iter()
        .map(|file_name| file_name.map(|e| e.path()).unwrap())
        .collect();

    let files_filtered: Vec<PathBuf> = files
        .iter()
        .filter(|file| Path::extension(file.as_path()) == Some(OsStr::new("tl")))
        .map(|file| file.to_owned())
        .collect();
    let files_output: Vec<&str> = files_filtered
        .iter()
        .map(|file_path| Path::file_stem(file_path).unwrap().to_str().unwrap())
        .collect();
    Ok(files_output.join(","))
}
#[tauri::command]
fn get_file_content(file_string: String) -> Result<String, String> {
    let proj_dirs = ProjectDirs::from("org", "zendard", "TobyLearn");
    if proj_dirs.is_none() {
        return Err("Project directory not found".to_string());
    }
    let proj_dirs = ProjectDirs::from("org", "zendard", "TobyLearn").unwrap();
    let sets_folder_path = Path::new(&proj_dirs.config_dir()).join("sets");
    if !sets_folder_path.is_dir() {
        fs::create_dir(sets_folder_path).err();
    }
    let sets_folder_path = Path::new(&proj_dirs.config_dir()).join("sets");

    let file_path = sets_folder_path.join(&file_string);
    if !file_path.is_file() {
        let file_path_error = file_path.as_os_str().to_str().unwrap();
        return Err(format!("Error while reading file {file_path_error}").to_string());
    }

    let file_content: String = String::from_utf8(fs::read(file_path).unwrap()).unwrap();
    Ok(file_content)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_all_sets, get_file_content])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
