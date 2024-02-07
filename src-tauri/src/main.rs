// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
extern crate directories;
use directories::ProjectDirs;
use std::fs;
use std::path::Path;
use std::time::Duration;
use tauri::api::{dialog, http};

fn get_project_dir() -> Result<ProjectDirs, String> {
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
#[tauri::command]
fn get_all_sets() -> Result<String, String> {
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

#[tauri::command]
fn get_file_content(file_string: String) -> Result<String, String> {
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

#[tauri::command]
fn save_settings(settings: String) -> Result<String, String> {
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

#[tauri::command]
fn get_settings() -> Result<String, String> {
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

#[tauri::command]
fn save_set(title: String, json: String) -> Result<String, String> {
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

#[tauri::command]
fn delete_set(set_name: String) -> Result<String, String> {
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

use tauri::api::dialog::blocking::FileDialogBuilder;
#[tauri::command]
fn import_set() -> Result<String, String> {
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

#[tauri::command]
async fn check_update() -> Result<String, String> {
    let proj_dirs = match get_project_dir() {
        Err(e) => return Err(e.into()),
        Ok(data) => data,
    };
    let version_file_path = proj_dirs.config_dir().join("current.version");

    let current_version = match fs::read_to_string(&version_file_path) {
        Err(e) => return Err(format!("Error while reading version file: {e}")),
        Ok(data) => data,
    };

    let data_string =
        request("https://raw.githubusercontent.com/Zendard/TobyLearn/main/newest.version").await;
    let data: Vec<&str> = data_string.split("\n").collect();
    let newest_version = data[0];
    let changelog = data[1];

    println!("Current: {} | Newest: {}", current_version, newest_version);

    if current_version >= newest_version.to_string() {
        return Ok("Already newest version".to_string());
    }

    dialog::MessageDialogBuilder::new(
        "New version!",
        format!("Version {newest_version} is available!\n\nChangelog:\n{changelog}"),
    )
    .buttons(dialog::MessageDialogButtons::OkCancelWithLabels(
        "Download".to_string(),
        "Cancel".to_string(),
    ))
    .kind(dialog::MessageDialogKind::Info)
    .show(|download| {
        if !download {
            return;
        }

        match open::that("https://github.com/Zendard/TobyLearn/releases") {
            Err(e) => println!("Error while opening link: {:?}", e),
            Ok(data) => data,
        };
    });
    Ok("Checked update".to_string())
}

async fn request(url: &str) -> String {
    let client = http::ClientBuilder::new()
        .connect_timeout(Duration::from_millis(5000))
        .build()
        .unwrap();
    let request = http::HttpRequestBuilder::new("GET", url)
        .unwrap()
        .response_type(http::ResponseType::Text);

    let response = client.send(request).await;
    let data: String = response
        .unwrap()
        .read()
        .await
        .unwrap()
        .data
        .as_str()
        .unwrap()
        .to_owned();
    println!("Data: {:?}", data);
    return data;
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let proj_dirs = match get_project_dir() {
                Err(e) => return Err(e.into()),
                Ok(data) => data,
            };
            let version_file_path = proj_dirs.config_dir().join("current.version");

            let current_version = app.package_info().version.to_string();

            match fs::write(&version_file_path, current_version) {
                Err(e) => return Err(e.into()),
                Ok(data) => data,
            };
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_all_sets,
            get_file_content,
            save_settings,
            get_settings,
            save_set,
            delete_set,
            import_set,
            check_update
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
