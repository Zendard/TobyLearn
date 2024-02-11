use crate::get_file_content;
use std::fs;
use tauri::api::dialog::blocking::FileDialogBuilder;

#[tauri::command]
pub fn export_set(set_name: String) -> Result<String, String> {
    let save_path = FileDialogBuilder::new()
        .set_title("Choose export location")
        .save_file()
        .unwrap();
    if !save_path.is_dir() {
        return Ok("Cancelled export".to_string());
    }
    let save_path = save_path.join(set_name.clone() + ".tl");

    let set_content = match get_file_content(set_name.clone()) {
        Err(e) => return Err(e),
        Ok(data) => data,
    };

    match fs::write(save_path, set_content) {
        Err(e) => return Err(format!("Error while saving set: {e}")),
        Ok(_data) => return Ok(format!("Exported set {set_name}")),
    }
}
