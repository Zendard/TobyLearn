use crate::get_project_dir;
use std::fs;

#[tauri::command]
pub fn get_settings() -> Result<String, String> {
    let proj_dirs = match get_project_dir() {
        Err(e) => return Err(e),
        Ok(data) => data,
    };
    let settings_file = proj_dirs.preference_dir().join("settings.json");
    if !settings_file.is_file() {
        match fs::write(
            &settings_file,
            "{\"accentColor\":\"purple\",\"randomizeQuestions\":true}",
        ) {
            Ok(_data) => println!("LOG: created settings.json"),
            Err(e) => return Err(format!("Error while creating settings file: {e}")),
        }
    }

    let settings = match fs::read_to_string(settings_file) {
        Err(e) => return Err(format!("Error while reading settings.json: {e}")),
        Ok(data) => data,
    };
    return Ok(settings);
}
