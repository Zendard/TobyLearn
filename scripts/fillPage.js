let setSelectSectionGrid = document.querySelector("#choose-set>.grid");

async function getSetsFromBackend() {
	setsDict = await window.electronAPI.getSets();
	console.log(setsDict);
	return setsDict;
}
async function addLinks() {
	Object.keys(await getSetsFromBackend()).forEach((setName) => {
		const setLink = document.createElement("a");
		setLink.classList.add("set");
		setLink.href = "#" + setName;
		setLink.innerText = setName;
		setSelectSectionGrid.appendChild(setLink);
	});
}

async function addSections() {
	Object.keys(await getSetsFromBackend()).forEach((setName) => {
		const setSection = document.createElement("section");
		setSection.id = setName;
		setSection.classList.add("questioner");

		const title = document.createElement("h2");
		title.classList.add("top");
		title.innerText = setName;

		const question = document.createElement("h2");
		question.classList.add("question");

		const formDiv = document.createElement("div");
		formDiv.classList.add("form");

		const input = document.createElement("input");
		input.classList.add("answer");

		const button = document.createElement("button");
		button.classList.add("check", "neutral");
		const i = document.createElement("i");
		i.classList.add("fa-solid", "fa-question");

		const bottomToolbar = document.createElement("div");
		bottomToolbar.classList.add("bottom-toolbar");
		const terug = document.createElement("a");
		terug.classList.add("back");
		terug.innerText = "Terug";
		terug.href = "#choose-set";

		document.body.append(setSection);
		setSection.appendChild(title);
		setSection.appendChild(question);
		setSection.appendChild(formDiv);
		formDiv.appendChild(input);
		formDiv.appendChild(button);
		button.appendChild(i);
		setSection.appendChild(bottomToolbar).appendChild(terug);
	});
}

addLinks();
addSections();
