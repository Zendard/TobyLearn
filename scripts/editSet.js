const editSection = document.querySelector("#edit-set");
const editButtons = document.querySelectorAll(".edit-set");

editButtons.forEach((editButton) => {
	editButton.addEventListener("click", editSet);
});

async function editSet(e) {
	const setName = e.currentTarget.parentNode.innerText.toLowerCase();
	e.preventDefault();
	const sets = await window.electronAPI.getSets();
	const set = sets[setName];
	console.log(set);
	editSection.querySelector("#set-title").value = setName;
	window.location.href = "#edit-set";
	const editForm = editSection.querySelector("form");

	let inputCounter = 1;
	Object.keys(set).forEach((key) => {
		console.log(key);
		fillInput();
		editForm.querySelector(
			`fieldset#card-${inputCounter}>input#q-${inputCounter}`
		).value = key;
		editForm.querySelector(
			`fieldset#card-${inputCounter}>input#a-${inputCounter}`
		).value = set[key];
	});
	inputCounter++;
	fillInput();
	let lastInput = editForm.querySelector(
		`fieldset#card-${inputCounter}>input#a-${inputCounter}`
	);
	console.log(lastInput);

	inputCounter--;
	inputCounter--;
	lastInput.addEventListener("input", addNewInput);
}

function fillInput() {
	const editForm = editSection.querySelector("form");
	const submitButton = editForm.querySelector("button.edit-set-confirm");
	const newCard = document.createElement("fieldset");
	const questionInput = document.createElement("input");
	const answerInput = document.createElement("input");
	newCard.id = `card-${inputCounter}`;
	questionInput.id = `q-${inputCounter}`;
	questionInput.name = `q-${inputCounter}`;
	answerInput.id = `a-${inputCounter}`;
	answerInput.name = `a-${inputCounter}`;
	editForm.insertBefore(newCard, submitButton);
	newCard.appendChild(questionInput);
	newCard.appendChild(answerInput);
	questionInput.addEventListener("input", () => {
		questionInput.style.width = questionInput.value.length + 1 + "rem";
	});
	answerInput.addEventListener("input", () => {
		answerInput.style.width = answerInput.value.length + 1 + "rem";
	});
	inputCounter++;
}

function addNewInput(e) {
	const editForm = editSection.querySelector("form");
	const submitButton = editForm.querySelector("button.edit-set-confirm");
	console.log(inputCounter - 1);
	lastInput = editForm.querySelector(
		`fieldset#card-${inputCounter - 1}>input#a-${inputCounter - 1}`
	);
	console.log(lastInput);
	lastInput.removeEventListener("input", addNewInput);
	const newCard = document.createElement("fieldset");
	const questionInput = document.createElement("input");
	const answerInput = document.createElement("input");
	newCard.id = `card-${inputCounter}`;
	questionInput.id = `q-${inputCounter}`;
	questionInput.name = `q-${inputCounter}`;
	answerInput.id = `a-${inputCounter}`;
	answerInput.name = `a-${inputCounter}`;
	editForm.insertBefore(newCard, submitButton);
	newCard.appendChild(questionInput);
	newCard.appendChild(answerInput);
	questionInput.addEventListener("input", () => {
		questionInput.style.width = questionInput.value.length + 1 + "rem";
	});
	answerInput.addEventListener("input", () => {
		answerInput.style.width = answerInput.value.length + 1 + "rem";
	});
	lastInput = answerInput;
	lastInput.addEventListener("input", addNewInput);
	inputCounter++;
}
