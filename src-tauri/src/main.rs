// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
extern crate directories;
use directories::ProjectDirs;
use std::fs;
use std::path::Path;

fn get_project_dir() -> Result<ProjectDirs, String> {
    let proj_dirs = ProjectDirs::from("org", "zendard", "TobyLearn");
    if proj_dirs.is_none() {
        return Err("Can't find project dirs".to_string());
    }
    let proj_dirs = proj_dirs.unwrap();
    if !proj_dirs.data_dir().is_dir() {
        match fs::create_dir_all(proj_dirs.data_dir()) {
            Err(e) => return Err(format!("Error while making project data dir: {e}")),
            Ok(_) => println!("Made project data dir as it did not exist"),
        };
    }
    if !proj_dirs.preference_dir().is_dir() {
        match fs::create_dir_all(proj_dirs.preference_dir()) {
            Err(e) => return Err(format!("Error while making project preference dir: {e}")),
            Ok(_) => println!("Made project preference dir as it did not exist"),
        };
    }
    return Ok(proj_dirs);
}
#[tauri::command]
fn get_all_sets() -> Result<String, String> {
    let proj_dirs = match get_project_dir() {
        Err(e) => return Err(e),
        Ok(data) => data,
    };

    if !proj_dirs.data_dir().join("sets").is_dir() {
        match fs::create_dir_all(proj_dirs.data_dir().join("sets")) {
            Err(e) => return Err(format!("Error while creating sets dir: {e}")),
            Ok(dir) => dir,
        }
    }

    let files = match proj_dirs.data_dir().join("sets").read_dir() {
        Err(e) => return Err(format!("Error while getting sets: {}", e)),
        Ok(files) => files,
    };
    let files_filtered: Vec<String> = files
        .filter(|file| file.as_ref().unwrap().path().extension().unwrap().to_str() == Some("tl"))
        .map(|file| {
            file.unwrap()
                .path()
                .file_stem()
                .unwrap()
                .to_str()
                .unwrap()
                .to_string()
        })
        .collect();
    let files_string = files_filtered.join(",");
    println!("{files_string}");
    Ok(files_string)
}

#[tauri::command]
fn get_file_content(file_string: String) -> Result<String, String> {
    let proj_dirs = ProjectDirs::from("org", "zendard", "TobyLearn");
    if proj_dirs.is_none() {
        return Err("Project directory not found".to_string());
    }
    let proj_dirs = ProjectDirs::from("org", "zendard", "TobyLearn").unwrap();
    let sets_folder_path = Path::new(&proj_dirs.data_dir()).join("sets");
    if !sets_folder_path.is_dir() {
        fs::create_dir(sets_folder_path).err();
    }
    let sets_folder_path = Path::new(&proj_dirs.data_dir()).join("sets");

    let file_path = sets_folder_path.join(&file_string);
    if !file_path.is_file() {
        let file_path_error = file_path.as_os_str().to_str().unwrap();
        return Err(format!("Error while reading file {file_path_error}").to_string());
    }

    let file_content: String = String::from_utf8(fs::read(file_path).unwrap()).unwrap();
    Ok(file_content)
}

#[tauri::command]
fn save_settings(settings: String) -> Result<String, String> {
    let proj_dirs = ProjectDirs::from("org", "zendard", "TobyLearn");
    if proj_dirs.is_none() {
        return Err("Project directory not found".to_string());
    }
    let settings_file = proj_dirs.unwrap().preference_dir().join("settings.json");
    match fs::write(settings_file, settings) {
        Err(e) => return Err(format!("Error saving settings: {e}").to_string()),
        Ok(_t) => return Ok("Saved settings".to_string()),
    };
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_all_sets,
            get_file_content,
            save_settings
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
