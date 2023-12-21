const section = document.querySelector("#frans");
const answerInput = section.querySelector("input");
const checkButton = section.querySelector("button");
const questionText = section.querySelector(".question");

function repeat(e) {
	checkButton
		.querySelector("i")
		.classList.replace("fa-rotate-right", "fa-question");
	checkButton.removeEventListener("click", repeat);
	mainLoop();
}

async function checkAnswer(e) {
	console.log(randomList);
	if (
		answerInput.value == (await randomList[Object.keys(randomList)[counter]])
	) {
		checkButton.querySelector("i").classList.replace("fa-question", "fa-check");
		checkButton.classList.replace("neutral", "correct");
		setTimeout(() => {
			checkButton
				.querySelector("i")
				.classList.replace("fa-check", "fa-question");
			checkButton.classList.replace("correct", "neutral");
		}, 600);
	} else {
		checkButton.querySelector("i").classList.replace("fa-question", "fa-xmark");
		checkButton.classList.replace("neutral", "wrong");
		setTimeout(() => {
			checkButton
				.querySelector("i")
				.classList.replace("fa-xmark", "fa-question");
			checkButton.classList.replace("wrong", "neutral");
		}, 600);
	}
	counter++;
	questionText.textContent = Object.keys(randomList)[counter];
	if (answerInput.value == randomList[Object.keys(randomList)[counter - 1]]) {
		counter--;
		delete randomList[Object.keys(randomList)[counter]];
		questionText.textContent = Object.keys(randomList)[counter];
	}
	if (Object.keys(randomList).length <= counter) {
		randomList = Object.fromEntries(
			Object.entries(randomList).sort(() => Math.random() - 0.5)
		);
		counter = 0;
		questionText.textContent = Object.keys(randomList)[counter];
	}
	answerInput.value = "";
	if (Object.keys(randomList).length <= 0) {
		questionText.textContent = "Set voltooid!";
		setTimeout(() => {
			checkButton
				.querySelector("i")
				.classList.replace("fa-question", "fa-rotate-right");
		}, 600);
		checkButton.removeEventListener("click", checkAnswer);
		checkButton.addEventListener("click", repeat);
	}
}
async function getSetsFromBackend() {
	const setList = await window.electronAPI.getSets();
	const wordList = setList.frans;
	randomList = await Object.fromEntries(
		Object.entries(wordList).sort(() => Math.random() - 0.5)
	);
	return randomList;
}
let randomList;
let counter = 0;

function mainLoop() {
	counter = 0;
	getSetsFromBackend().then((randomList) => {
		console.log(randomList);
		questionText.textContent = Object.keys(randomList)[counter];
		answerInput.addEventListener("keypress", (e) => {
			if (e.key === "Enter") {
				checkAnswer();
			}
		});
		checkButton.addEventListener("click", checkAnswer);
	});
}
mainLoop();
