use crate::get_project_dir;
use std::{fs, path::Path};

#[tauri::command]
pub fn save_set(title: String, json: String) -> Result<String, String> {
    let proj_dirs = match get_project_dir() {
        Err(e) => return Err(e),
        Ok(data) => data,
    };
    let sets_folder_path = Path::new(&proj_dirs.data_dir()).join("sets");
    if !sets_folder_path.is_dir() {
        match fs::create_dir(sets_folder_path) {
            Err(e) => return Err(format!("Error while creating sets dir: {e}")),
            Ok(dir) => dir,
        };
    }
    let set_file_path = Path::new(&proj_dirs.data_dir())
        .join("sets")
        .join(format!("{title}.tl"));

    match fs::write(set_file_path, json) {
        Err(e) => return Err(format!("Error while writing set file: {e}")),
        Ok(_data) => {
            println!("LOG: saved set {title}.tl");
            return Ok(format!("Saved set {title}.tl!"));
        }
    }
}
