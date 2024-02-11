use crate::get_project_dir;
use std::fs;
use tauri::api::dialog::blocking::FileDialogBuilder;

#[tauri::command]
pub fn import_set() -> Result<String, String> {
    let proj_dirs = match get_project_dir() {
        Err(e) => return Err(e),
        Ok(data) => data,
    };

    let file_path = FileDialogBuilder::new()
        .add_filter("TobyLearn Sets (.tl)", &["tl"])
        .pick_file()
        .unwrap();

    let file_destination = proj_dirs
        .data_dir()
        .join("sets")
        .join(file_path.file_name().unwrap());

    match fs::copy(&file_path, file_destination) {
        Err(e) => return Err(format!("Error while copying file: {e}")),
        Ok(_data) => return Ok(format!("Imported {:?}", file_path)),
    };
}
