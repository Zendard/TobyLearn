const section = document.querySelector("#frans");
const answerInput = section.querySelector("input");
const checkButton = section.querySelector("button");
const questionText = section.querySelector(".question");
const wordList = JSON.parse(section.querySelector(".answer-list").textContent);

let randomList = Object.fromEntries(
	Object.entries(wordList).sort(() => Math.random() - 0.5)
);

let counter = 0;
questionText.textContent = Object.keys(randomList)[counter];

checkButton.addEventListener("click", checkAnswer);
answerInput.addEventListener("keypress", (e) => {
	if (e.key === "Enter") {
		checkAnswer();
	}
});

function checkAnswer(e) {
	console.log(randomList);
	console.log(answerInput.value);
	console.log(randomList[Object.keys(randomList)[counter]]);
	if (answerInput.value == randomList[Object.keys(randomList)[counter]]) {
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
	}
}
