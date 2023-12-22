const section = document.querySelector("#questioner");
const questionText = section.querySelector("#question");
const title = section.querySelector(".top");
const answerInput = section.querySelector("#answer");
const checkButton = section.querySelector("#check");
let questionCounter;

const linkList = document.querySelectorAll("#choose-set>.grid>a");

linkList.forEach((link) => {
	link.addEventListener("click", (e) => {
		const questioner = document.querySelector("#questioner");
		questioner.dataset.set = link.textContent;
		init(link.textContent);
	});
});

async function init(setName) {
	questionCounter = 0;
	const allSets = await window.electronAPI.getSets();
	set = await shuffleObject(allSets[setName]);
	questionText.textContent = Object.keys(set)[questionCounter];
	title.textContent = setName;
	answerInput.addEventListener("keydown", keyboardCheck);
	checkButton.addEventListener("click", checkAnswer);
	answerInput.style.display = "block";
	checkButton.style.display = "block";
}

async function checkAnswer() {
	console.log(set);
	if (answerInput.value == set[questionText.textContent]) {
		correct();
	} else {
		wrong();
	}
	answerInput.value = "";
	if (Object.keys(set).length <= 0) {
		questionText.textContent = "Set gedaan!";
		setTimeout(() => {
			answerInput.style.display = "none";
			checkButton.style.display = "none";
		}, 700);
	}
}

async function correct() {
	delete set[Object.keys(set)[questionCounter]];
	questionText.textContent = Object.keys(set)[questionCounter];
	checkButton.classList.add("correct");
	checkButton.classList.remove("neutral");
	setTimeout(() => {
		checkButton.classList.add("neutral");
		checkButton.classList.remove("correct");
	}, 700);
}

async function wrong() {
	questionCounter++;
	if (questionCounter >= Object.keys(set).length) {
		questionCounter = 0;
	}
	questionText.textContent = Object.keys(set)[questionCounter];
	checkButton.classList.add("wrong");
	checkButton.classList.remove("neutral");
	setTimeout(() => {
		checkButton.classList.add("neutral");
		checkButton.classList.remove("wrong");
	}, 700);
}
function shuffleObject(obj) {
	const keys = Object.keys(obj);
	const shuffledKeys = keys.sort(() => Math.random() - 0.5);
	const shuffledObj = {};
	shuffledKeys.forEach((key) => {
		shuffledObj[key] = obj[key];
	});
	return shuffledObj;
}

async function keyboardCheck(e) {
	if (e.key === "Enter") {
		if (e.key === "Enter") {
			checkAnswer();
		}
	}
}
