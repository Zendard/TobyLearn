const { app, BrowserWindow, ipcMain } = require("electron/main");
const fs = require("fs");
const path = require("path");
const setsPath = "./sets/";
if (require("electron-squirrel-startup")) app.quit();
try {
	require("electron-reloader")(module);
} catch (_) {}

const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	});
	// win.removeMenu();
	win.loadFile("./index.html");
};

app.whenReady().then(() => {
	ipcMain.handle("getSets", getSets);
	createWindow();

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

async function getSets() {
	return new Promise((resolve, reject) => {
		let sets = {};
		fs.readdir(setsPath, (err, files) => {
			if (err) {
				console.error("Error reading directory:", err);
				reject(err);
				return;
			}
			const tlFiles = files.filter((file) => path.extname(file) === ".tl");
			const readFilePromises = tlFiles.map((file) => {
				return new Promise((resolve, reject) => {
					fs.readFile(setsPath + file, "utf8", (err, data) => {
						if (err) {
							console.error("Error reading file:", err);
							reject(err);
							return;
						}
						const dictionary = JSON.parse(data);
						sets[path.basename(file, ".tl")] = dictionary;
						resolve();
					});
				});
			});
			Promise.all(readFilePromises)
				.then(() => {
					resolve(sets);
				})
				.catch((error) => {
					reject(error);
				});
		});
	});
}

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
