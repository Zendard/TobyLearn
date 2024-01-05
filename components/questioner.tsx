import { Input } from '@/components/ui/input'
import { Button } from './ui/button'
import { invoke } from '@tauri-apps/api'
import { useState,useEffect, SetStateAction } from 'react'

export function Questioner({currentSet,setError}:{currentSet:string,setError:(arg0: string)=>void}){
	const [fileContent,setFileContent]=useState({string:'answer'})
	useEffect(()=>{
		GetSet(currentSet,setError,setFileContent)
	},[currentSet])
	const [questionCounter,setQuestionCounter]=useState(0)

	
	return(
		<div className="questioner flex flex-col gap-5">
			<h1 id="question" className="text-7xl">{Object.keys(fileContent)[questionCounter]}</h1>
			<div className="flex gap-3">
				<Input type="text" placeholder="Antwoord"></Input>
				<Button onClick={()=>setQuestionCounter(questionCounter+1)}>Ok</Button>
			</div>
		</div>
	)
}
function GetSet(currentSet:string,setError:(arg0: string)=>void,setFileContent:(arg0:SetStateAction<{string:string}>)=>void){
	if(currentSet.length<=0) return

	invoke<string>('get_file_content',{'fileString':currentSet+'.tl'}).then((fileContent)=>{
		setFileContent(JSON.parse(fileContent))
		console.log(fileContent)
	}).catch(setError)

}