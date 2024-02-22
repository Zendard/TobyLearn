use crate::get_project_dir;
use std::{fs, time::Duration};
use tauri::api::{dialog, http};

#[tauri::command]
pub async fn check_update() -> Result<String, String> {
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

    println!(
        "LOG: Current: {} | Newest: {}",
        current_version, newest_version
    );

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
    return data;
}
