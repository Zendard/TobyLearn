extern crate directories;
use directories::ProjectDirs;
use std::fs;
pub fn get_project_dir() -> Result<ProjectDirs, String> {
    let proj_dirs = ProjectDirs::from("org", "zendard", "tobyLearn");
    if proj_dirs.is_none() {
        return Err("Can't find project dirs".to_string());
    }
    let proj_dirs = proj_dirs.unwrap();
    if !proj_dirs.data_dir().is_dir() {
        match fs::create_dir_all(proj_dirs.data_dir()) {
            Err(e) => return Err(format!("Error while making project data dir: {e}")),
            Ok(_) => println!("Made project data dir as it did not exist"),
        };
    }
    if !proj_dirs.preference_dir().is_dir() {
        match fs::create_dir_all(proj_dirs.preference_dir()) {
            Err(e) => return Err(format!("Error while making project preference dir: {e}")),
            Ok(_) => println!("Made project preference dir as it did not exist"),
        };
    }
    return Ok(proj_dirs);
}
