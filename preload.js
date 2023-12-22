const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("electronAPI", {
	getSets: () => ipcRenderer.invoke("getSets"),
	openFile: () => ipcRenderer.invoke("dialog:openFile"),
});
