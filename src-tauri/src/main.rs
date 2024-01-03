// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use serde_json::json;
use std::fs;
use std::path::Path;
use tauri::Result;

const FOLDER_PATH: &str = "/home/zendard/Downloads";
fn get_files() -> Result<String> {
    let mut file_data: serde_json::Value = json!({});

    for entry in fs::read_dir(FOLDER_PATH)? {
        let entry: fs::DirEntry = entry?;
        let file_path: std::path::PathBuf = entry.path();

        if let Some(extension) = file_path.extension() {
            if extension == "tl" {
                let file_name: String = entry
                    .file_name()
                    .to_string_lossy()
                    .into_owned()
                    .replace(".tl", "");
                let file_content: String = fs::read_to_string(file_path)?;

                file_data[file_name] = json!(file_content);
            }
        }
    }

    let json_string: String = serde_json::to_string(&file_data)?;

    Ok(json_string)
}

#[tauri::command]
fn get_sets() -> String {
    match get_files() {
        Ok(sets) => return sets,
        Err(e) => {
            eprintln!("{}", e);
            return "Error while reading files!".to_string();
        }
    }
}
#[tauri::command]
fn get_file_content(file_name: String) -> Result<String> {
    let file_content = fs::read_to_string(Path::new(FOLDER_PATH).join(file_name + ".tl"))?;
    Ok(file_content)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_sets])
        .invoke_handler(tauri::generate_handler![get_file_content])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
