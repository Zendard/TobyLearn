const makeSetForm = document.querySelector("#new-set>form");

makeSetForm
	.querySelector("button.new-set")
	.addEventListener("click", getFormData);

async function getFormData(e) {
	const formData = new FormData(makeSetForm);
	await window.electronAPI.makeSet(formData);
}
