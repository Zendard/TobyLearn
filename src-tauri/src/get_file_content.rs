use crate::get_project_dir;
use std::fs;
use std::path::Path;

#[tauri::command]
pub fn get_file_content(file_string: String) -> Result<String, String> {
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
    let sets_folder_path = Path::new(&proj_dirs.data_dir()).join("sets");

    let file_path = sets_folder_path.join(&file_string);

    let file_content = match fs::read_to_string(file_path) {
        Err(e) => return Err(format!("Error while reading file: {e}")),
        Ok(data) => data,
    };
    Ok(file_content)
}
