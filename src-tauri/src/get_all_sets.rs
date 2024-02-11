use crate::get_project_dir;
use std::fs;

#[tauri::command]
pub fn get_all_sets() -> Result<String, String> {
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
    println!("LOG: {files_string}");
    Ok(files_string)
}
