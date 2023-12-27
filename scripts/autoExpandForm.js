const form = document.querySelector("#new-set>form");
const submitButton = form.querySelector("button.new-set");
let inputCounter = 1;

let lastInput = form.querySelector(
	`fieldset#card-${inputCounter}>input#a-${inputCounter}`
);

lastInput.addEventListener("input", addNewInput);

function addNewInput(e) {
	lastInput.removeEventListener("input", addNewInput);
	inputCounter++;
	const newCard = document.createElement("fieldset");
	const questionInput = document.createElement("input");
	const answerInput = document.createElement("input");
	newCard.id = `card-${inputCounter}`;
	questionInput.id = `q-${inputCounter}`;
	questionInput.name = `q-${inputCounter}`;
	answerInput.id = `a-${inputCounter}`;
	answerInput.name = `a-${inputCounter}`;
	form.insertBefore(newCard, submitButton);
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
}
