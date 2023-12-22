const importButton = document.querySelector("button#import");
const dialog = document.querySelector("dialog#file-exists");

async function importFile() {
	const importSuccess = await window.electronAPI.openFile();
	window.location.href = await "#choose-set";
	location.reload();
}

importButton.addEventListener("click", importFile);
