use crate::get_project_dir;
use std::{fs, path::Path};

#[tauri::command]
pub fn delete_set(set_name: String) -> Result<String, String> {
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
        .join(format!("{set_name}.tl"));

    match fs::remove_file(set_file_path) {
        Err(e) => return Err(format!("Error while deleting set: {e}")),
        Ok(_data) => return Ok(format!("Deleted set {set_name}")),
    }
}
