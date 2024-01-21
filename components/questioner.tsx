import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { invoke } from '@tauri-apps/api'
import { useState,useEffect, SetStateAction, Dispatch} from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { UseFormReturn, useForm } from 'react-hook-form'
import * as z from 'zod'
import { useToast } from './ui/use-toast'

export function Questioner({currentSet}:{currentSet:string}){
	const [fileContent,setFileContent]=useState(Object)
	const [keyArray,setKeyArray]=useState([''])
	const {toast}=useToast()

	useEffect(()=>{
		GetSet(currentSet,setFileContent,setKeyArray,toast)
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

	useEffect(()=>shuffleKeys(fileContent,setKeyArray),[Object.keys(fileContent).length])

	const [buttonClass,setButtonClass]=useState('')
	
	return(
		<div className="questioner flex flex-col gap-5">
			<h1 id="question" className="text-7xl text-center">{keyArray[questionCounter]}</h1>
			<Form {...form}>
				<form className="flex gap-3" onSubmit={
					form.handleSubmit((data)=>checkAnswer(questionCounter,fileContent,data,form,setButtonClass,setFileContent,setQuestionCounter,keyArray))
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
function GetSet(currentSet:string, setFileContent: Dispatch<SetStateAction<{[question:string]:string}>>, setKeyArray: (arg0: string[])=>void,toast: ((arg0: { variant: 'destructive'; title: string; description: string }) => void)){
	if (currentSet.length<=0) return

	invoke<string>('get_file_content',{'fileString':currentSet+'.tl'}).then((fileContent)=>{
		const JSONFile= JSON.parse(fileContent)
		shuffleKeys(JSONFile,setKeyArray)
		setFileContent(JSONFile)
	}).catch((e)=>toast({
		variant:'destructive',
		title: 'Error!',
		description: e,
	}))

}

function shuffleKeys(JSONFile: object,setKeyArray:(arg0: string[])=>void){
	const shuffledKeys=Object.keys(JSONFile).sort(()=>Math.round(Math.random())-0.5)
	setKeyArray(shuffledKeys)
}

const FormSchema = z.object({
	answer: z.string(),
})

function checkAnswer(questionCounter:number,fileContent:{[question:string]:string},data: z.infer<typeof FormSchema>,form: UseFormReturn<{ answer: string }>,setButtonClass: Dispatch<SetStateAction<string>>,setFileContent: Dispatch<SetStateAction<{ [question:string]: string }>>,setQuestionCounter: { (value: SetStateAction<number>): void; (arg0: number): void },keyArray: (string | number)[]){
	if(data.answer == fileContent[keyArray[questionCounter]]){
		const newObject=fileContent
		delete newObject[keyArray[questionCounter]]
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