const deleteButtons = document.querySelectorAll(".delete-set");
const deleteDialog = document.querySelector("#delete-dialog");
let setName = "";

deleteButtons.forEach((button) => {
	button.addEventListener("click", showModal);
});

async function showModal(e) {
	setName = e.currentTarget.parentNode.innerText;
	e.preventDefault();
	deleteDialog.querySelector(
		"p"
	).textContent = `Weet je zeker dat je ${setName} wilt verwijderen?`;
	deleteDialog.showModal();
	deleteDialog.querySelector(".delete").addEventListener("click", deleteSet);
}

async function deleteSet(e) {
	await window.electronAPI.deleteSet(setName);
	window.location.href = await "#choose-set";
	await window.location.reload();
}
