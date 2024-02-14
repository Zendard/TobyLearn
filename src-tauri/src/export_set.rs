use crate::get_file_content;
use std::fs;
use tauri::api::dialog::blocking::FileDialogBuilder;

#[tauri::command]
pub async fn export_set(set_name: String) -> Result<String, String> {
    let selected_path = FileDialogBuilder::new()
        .set_title("Choose export location")
        .set_file_name(&set_name)
        .add_filter("TobyLearn Sets (.tl)", &["tl"])
        .save_file();
    let mut save_path = match selected_path {
        None => return Ok("Cancelled export".to_string()),
        Some(data) => data,
    };
    save_path.set_extension("tl");

    let set_content = match get_file_content(set_name.clone()) {
        Err(e) => return Err(e),
        Ok(data) => data,
    };

    match fs::write(save_path, set_content) {
        Err(e) => return Err(format!("Error while saving set: {e}")),
        Ok(_data) => return Ok(format!("Exported set {set_name}")),
    }
}
