# TobyLearn (tauri rewrite)

Made as an alternative to the increasingly commercial Quizlet, this program aims to provide a simple and efficient learning experience without paywalls or unnecessary distractions.

This branch is a rewrite of main written in tauri(rust) instead of electron(node)

## Roadmap

- GUI for creating sets
- More integration with operating system (drag and drop sets, ...)
- Accent buttons
- Choice of case/accent sensitivity

## Creating sets

Currently there is no GUI for creating sets but instead it is done by creating a .tl file and editing it with a text editor

Example .tl file:

```json
{
	"question": "answer",

	"huis": "maison",
	"auto": "voiture",
	"boek": "livre",
	"fiets": "vélo",
	"tafel": "table",
	"stoel": "chaise"
}
```
