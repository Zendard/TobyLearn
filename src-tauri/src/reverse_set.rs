use crate::get_file_content;
use crate::save_set;
use serde_json::{self, Value};

#[tauri::command]
pub fn reverse_set(set_name: String) -> Result<String, String> {
    let file_content = match get_file_content(set_name.clone()) {
        Err(e) => return Err(e),
        Ok(data) => data,
    };

    let json: Value = match serde_json::from_str(&file_content) {
        Err(e) => return Err(e.to_string()),
        Ok(data) => data,
    };
    let reversed_json = match reverse_json(&json) {
        Err(e) => return Err(e),
        Ok(data) => data,
    };
    match save_set(set_name.clone(), reversed_json.to_string()) {
        Err(e) => return Err(e),
        Ok(_) => return Ok(format!("Reversed set {set_name}")),
    };
}

fn reverse_json(json: &Value) -> Result<Value, String> {
    match json {
        Value::Object(map) => {
            let mut reversed = serde_json::Map::new();
            for (key, value) in map {
                match value {
                    Value::String(s) => {
                        reversed.insert(s.clone(), Value::String(key.clone()));
                    }
                    _ => return Err(format!("Cannot reverse key/value for key: {}", key)),
                }
            }
            Ok(Value::Object(reversed))
        }
        _ => Err("Input should be a JSON object".to_string()),
    }
}
