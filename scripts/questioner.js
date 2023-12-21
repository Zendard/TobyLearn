const section = document.querySelector("#frans");
const answerInput = section.querySelector("input");
const checkButton = section.querySelector("button");
const questionText = section.querySelector(".question");
const wordList = JSON.parse(section.querySelector(".answer-list").textContent);

const randomList = Object.fromEntries(
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
	console.log(answerInput.value);
	console.log(randomList[Object.keys(randomList)[counter]]);
	if (answerInput.value == randomList[Object.keys(randomList)[counter]]) {
		console.log("Correct!");
		checkButton.querySelector("i").classList.replace("fa-question", "fa-check");
		checkButton.classList.replace("neutral", "correct");
		setTimeout(() => {
			checkButton
				.querySelector("i")
				.classList.replace("fa-check", "fa-question");
			checkButton.classList.replace("correct", "neutral");
		}, 600);
	} else {
		console.log("wrong!");
	}
	counter++;
	questionText.textContent = Object.keys(randomList)[counter];
	answerInput.value = "";
}
