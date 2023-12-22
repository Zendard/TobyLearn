const importButton = document.querySelector("button#import");
const dialog = document.querySelector("dialog#file-exists");

async function importFile() {
	const importSuccess = await window.electronAPI.openFile();
	window.location.href = await "#choose-set";
	await console.log("reloaded!");
	setTimeout(() => {
		window.location.reload();
	}, 500);
}

importButton.addEventListener("click", importFile);
