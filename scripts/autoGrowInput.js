const inputList = document.querySelectorAll("input");

inputList.forEach((inputElement) => {
	inputElement.addEventListener("input", () => {
		inputElement.style.width = inputElement.value.length + 1 + "rem";
	});
});
