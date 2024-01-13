import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { invoke } from '@tauri-apps/api'
import { useState,useEffect, SetStateAction, Dispatch} from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { UseFormReturn, useForm } from 'react-hook-form'
import * as z from 'zod'

export function Questioner({currentSet,setError}:{currentSet:string,setError:(arg0: string)=>void}){
	const [fileContent,setFileContent]=useState(Object)
	useEffect(()=>{
		GetSet(currentSet,setError,setFileContent)
	},[currentSet])
	const [questionCounter,setQuestionCounter]=useState(0)

	useEffect(()=>{
		if(questionCounter>=Object.keys(fileContent).length){
			setQuestionCounter(0)
		}
	},[questionCounter,Object.keys(fileContent).length])
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			answer: '',
		},
	})

	const [buttonClass,setButtonClass]=useState('')
	
	return(
		<div className="questioner flex flex-col gap-5">
			<h1 id="question" className="text-7xl">{Object.keys(fileContent)[questionCounter]}</h1>
			<Form {...form}>
				<form className="flex gap-3" onSubmit={
					form.handleSubmit((data)=>checkAnswer(questionCounter,fileContent,data,form,setButtonClass,setFileContent,setQuestionCounter))
				}>
					<FormField
						control={form.control}
						name="answer"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input placeholder="Antwoord" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<Button className={buttonClass}>Ok</Button>
				</form>
			</Form>
		</div>
	)
}
function GetSet(currentSet:string,setError:(arg0: string)=>void, setFileContent: Dispatch<SetStateAction<{[question:string]:string}>>){
	if (currentSet.length<=0) return

	invoke<string>('get_file_content',{'fileString':currentSet+'.tl'}).then((fileContent)=>{
		const JSONFile= JSON.parse(fileContent)
		Object.keys(JSONFile).sort(()=>Math.round(Math.random())-0.5)
		console.log(JSONFile)
		setFileContent(JSONFile)
	}).catch(setError)

}

const FormSchema = z.object({
	answer: z.string(),
})

function checkAnswer(questionCounter:number,fileContent:{[question:string]:string},data: z.infer<typeof FormSchema>,form: UseFormReturn<{ answer: string }>,setButtonClass: Dispatch<SetStateAction<string>>,setFileContent: Dispatch<SetStateAction<{ [question:string]: string }>>,setQuestionCounter: { (value: SetStateAction<number>): void; (arg0: number): void }){
	if(data.answer == fileContent[Object.keys(fileContent)[questionCounter]]){
		const newObject=fileContent
		delete newObject[Object.keys(newObject)[questionCounter]]
		setFileContent(newObject)
		setButtonClass('correct')
		setTimeout(()=>setButtonClass(''),1000)
	}else{
		setButtonClass('wrong')
		setTimeout(()=>setButtonClass(''),1000)
		if(questionCounter<Object.keys(fileContent).length){setQuestionCounter(questionCounter+1)}
		
	}
	form.setValue('answer','')
}