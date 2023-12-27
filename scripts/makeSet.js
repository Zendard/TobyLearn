const makeSetForm = document.querySelector("#new-set>form");
console.log(makeSetForm);
const button = makeSetForm.querySelector("button.new-set");

button.addEventListener("click", getFormData);

async function getFormData(e) {
	const formData = await new FormData(makeSetForm, button);
	const object = {};
	formData.forEach((value, key) => (object[key] = value));
	const json = JSON.stringify(object);
	window.electronAPI.makeSet(json);
}
