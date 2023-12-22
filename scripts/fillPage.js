let setSelectSectionGrid = document.querySelector("#choose-set>.grid");
let counter = 0;

async function getSetsFromBackend() {
	setsDict = await window.electronAPI.getSets();
	return setsDict;
}
async function addLinks() {
	Object.keys(await getSetsFromBackend()).forEach((setName) => {
		const setLink = document.createElement("a");
		setLink.classList.add("set");
		setLink.href = "#questioner";
		setLink.innerText = setName;
		setSelectSectionGrid.appendChild(setLink);
	});
}
addLinks();
