let setSelectSectionGrid = document.querySelector("#choose-set>.grid");
let counter = 0;

async function getSetsFromBackend() {
	setsDict = await window.electronAPI.getSets();
	return setsDict;
}
async function addLinks() {
	Object.keys(await getSetsFromBackend()).forEach((setName) => {
		const setLink = document.createElement("a");
		const deleteButton = document.createElement("button");
		const deleteIcon = document.createElement("i");

		setLink.classList.add("set");
		setLink.href = "#questioner";
		setLink.innerText = setName;
		deleteButton.classList.add("delete-set");
		deleteIcon.classList.add("fa-solid", "fa-trash-can");

		setSelectSectionGrid.appendChild(setLink);
		setLink.appendChild(deleteButton);
		deleteButton.appendChild(deleteIcon);
	});
}
addLinks();
