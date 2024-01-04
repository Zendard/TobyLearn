import { Input } from "@/components/ui/input"
import { Button } from "./ui/button"
import { invoke } from "@tauri-apps/api"
import { useState } from "react"

export function Questioner({currentSet}:{currentSet:string}){
	let [fileContent,setFileContent]=useState({'':''})
	let [questionCounter,setQuestionCounter]=useState(0)
	invoke<string>('get_file_content',{"fileString":currentSet+'.tl'}).then((fileContent)=>{setFileContent(JSON.parse(fileContent)); console.log(fileContent)}).catch((e)=>{console.log(currentSet+'.tl'); console.log(e)})
	return(
	<div className="questioner flex flex-col gap-5">
		<h1 id="question" className="text-7xl">{Object.keys(fileContent)[questionCounter]}</h1>
		<div className="flex gap-3">
			<Input type="text" placeholder="Antwoord"></Input>
			<Button>Ok</Button>
		</div>
	</div>
	)
}