const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("electronAPI", {
	getSets: () => ipcRenderer.invoke("getSets"),
	openFile: () => ipcRenderer.invoke("dialog:openFile"),
	makeSet: (formData) => ipcRenderer.send("makeSet", formData),
	deleteSet: (set) => ipcRenderer.send("deleteSet", set),
});
