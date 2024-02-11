use crate::get_project_dir;
use std::fs;

#[tauri::command]
pub fn save_settings(settings: String) -> Result<String, String> {
    let proj_dirs = match get_project_dir() {
        Err(e) => return Err(e),
        Ok(data) => data,
    };
    let settings_file = proj_dirs.preference_dir().join("settings.json");
    match fs::write(settings_file, settings) {
        Err(e) => return Err(format!("Error saving settings: {e}").to_string()),
        Ok(_t) => return Ok("Saved settings".to_string()),
    };
}
