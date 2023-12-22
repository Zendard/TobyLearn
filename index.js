const { options } = require("ejs-electron");
const { webContents } = require("electron");
const { app, BrowserWindow, ipcMain, dialog } = require("electron/main");
const fs = require("node:fs/promises");
const path = require("path");
const setsPath = path.join(app.getPath("userData"), "sets");
const { updateElectronApp } = require("update-electron-app");
if (require("electron-squirrel-startup")) app.quit();
try {
	require("electron-reloader")(module);
} catch (_) {}
updateElectronApp();

const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		icon: "./iconTL.png",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	});
	// win.removeMenu();
	win.loadFile("./index.html");
};

app.whenReady().then(async () => {
	await fs.mkdir(setsPath).catch((e) => {});
	console.log(setsPath);
	ipcMain.handle("getSets", getSets);
	ipcMain.handle("dialog:openFile", importFile);
	createWindow();

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

async function getSets() {
	return new Promise(async (resolve, reject) => {
		let sets = {};
		const files = await fs.readdir(setsPath).catch(callback);
		const tlFiles = files.filter((file) => path.extname(file) === ".tl");
		const readFilePromises = tlFiles.map(async (file) => {
			return new Promise(async (resolve, reject) => {
				const data = await fs
					.readFile(path.join(setsPath, file), "utf8")
					.catch(callback);
				const dictionary = JSON.parse(data);
				sets[path.basename(file, ".tl")] = dictionary;
				resolve();
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
}

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

async function importFile() {
	const { canceled, filePaths } = await dialog.showOpenDialog({
		filters: [{ name: "TobyLearn sets", extensions: ["tl"] }],
	});
	if (!canceled) {
		await filePaths.forEach(async (file) => {
			const statOriginal = await fs
				.stat(path.join(setsPath, file))
				.catch((e) => {});
			console.log(statOriginal);
			if (!statOriginal) {
				await fs
					.copyFile(file, path.join(setsPath, path.basename(file)))
					.catch(callback);
				return true;
			} else {
				let number;
				for (i = 1; i < 10; i++) {
					let stat = await fs
						.stat(
							path.join(
								setsPath,
								path.basename(file, ".tl") + "(" + i + ")" + ".tl"
							)
						)
						.catch((e) => {});
					if (!stat) {
						number = i;
						break;
					}
				}
				await fs
					.copyFile(
						file,
						path.join(
							"/",
							setsPath,
							path.basename(file, ".tl") + "(" + number + ")" + ".tl"
						)
					)
					.catch(callback);
				return true;
			}
		});
	}
}
function callback(err) {
	if (err) {
		throw err;
	}
}
