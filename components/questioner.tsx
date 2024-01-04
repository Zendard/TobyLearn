import { Input } from "@/components/ui/input"
import { Button } from "./ui/button"
import { invoke } from "@tauri-apps/api"

export function Questioner({currentSet}:{currentSet:string}){
	invoke('get_file_content',{file:currentSet})
	return(
	<div className="questioner flex flex-col gap-5">
		<h1 id="question" className="text-7xl">Question</h1>
		<div className="flex gap-3">
			<Input type="text" placeholder="Antwoord"></Input>
			<Button>Ok</Button>
		</div>
	</div>
	)
}