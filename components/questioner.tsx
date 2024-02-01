import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { useState,useEffect, SetStateAction, Dispatch} from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { UseFormReturn, useForm } from 'react-hook-form'
import * as z from 'zod'
import { useToast } from './ui/use-toast'
import { Isettings } from '@/app/page'
import { Progress } from '@/components/ui/progress'

export function Questioner({currentSet,settings,setCurrentSet}:{currentSet:string,settings:Isettings,setCurrentSet:(arg0:string)=>void}){
	const [fileContent,setFileContent]=useState(Object)
	const [keyArray,setKeyArray]=useState([''])
	const [initialLength,setInitialLength]=useState(0)
	const {toast}=useToast()
	useEffect(()=>{
		GetSet(currentSet,setFileContent,setKeyArray,toast,settings?.randomizeQuestions,setInitialLength)
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
			{Object.keys(fileContent).length>0 ?
				<>
					<h1 id="question" className="text-7xl text-center">{keyArray[questionCounter]}</h1>
					<Form {...form}>
						<form className="flex gap-3 justify-between" onSubmit={
							form.handleSubmit((data)=>checkAnswer(questionCounter,fileContent,data,form,setButtonClass,setFileContent,setQuestionCounter,keyArray,settings,setCurrentSet))
						}>
							<FormField
								control={form.control}
								name="answer"
								render={({ field }) => (
									<FormItem className='w-full'>
										<FormControl>
											<Input placeholder="Antwoord" {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<Button className={buttonClass}>Ok</Button>
						</form>
					</Form>
					<div className='flex justify-between gap-3 items-center'>
						<Progress value={(initialLength-Object.keys(fileContent).length)/initialLength*100} />
						<h1 className=' text-center align-middle'>{Math.round((initialLength-Object.keys(fileContent).length)/initialLength*10000)/100}%</h1>
					</div>
				</>
				:
				<>
					<h1 className='text-7xl text-center font-bold'>Finished set!</h1>
					<Button asChild className=' w-fit m-auto'><a href="#grid">Choose another set</a></Button>
				</>
			}
		</div>
	)
}
function GetSet(currentSet:string, setFileContent: Dispatch<SetStateAction<{[question:string]:string}>>, setKeyArray: (arg0: string[])=>void,toast: ((arg0: { variant: 'destructive'; title: string; description: string }) => void),randomizeQuestions:boolean,setInitialLength:(arg0: number)=>void){
	if (currentSet.length<=0) return
	import('@tauri-apps/api/index').then((tauri)=>{
		tauri.invoke<string>('get_file_content',{'fileString':currentSet+'.tl'}).then((fileContent)=>{
			const JSONFile= JSON.parse(fileContent)
			if(randomizeQuestions){
				shuffleKeys(JSONFile,setKeyArray)
			}else{
				setKeyArray(Object.keys(JSONFile))
			}
			setFileContent(JSONFile)
			setInitialLength(Object.keys(JSONFile).length)
		}).catch((e)=>{
			toast({
				variant:'destructive',
				title: 'Error!',
				description: e,
			})
		})
	})
}

function shuffleKeys(JSONFile: object,setKeyArray:(arg0: string[])=>void){
	const shuffledKeys=Object.keys(JSONFile).sort(()=>Math.round(Math.random())-0.5)
	setKeyArray(shuffledKeys)
}

const FormSchema = z.object({
	answer: z.string(),
})

function checkAnswer(questionCounter:number,fileContent:{[question:string]:string},data: z.infer<typeof FormSchema>,form: UseFormReturn<{ answer: string }>,setButtonClass: Dispatch<SetStateAction<string>>,setFileContent: Dispatch<SetStateAction<{ [question:string]: string }>>,setQuestionCounter: { (value: SetStateAction<number>): void; (arg0: number): void },keyArray: (string | number)[],settings:Isettings,setCurrentSet:(arg0:string)=>void){
	if(data.answer == fileContent[keyArray[questionCounter]] || (!settings.caseSensitive && data.answer.toLowerCase() == fileContent[keyArray[questionCounter]].toLowerCase())){
		const newObject=fileContent
		delete newObject[keyArray[questionCounter]]
		setFileContent(newObject)
		setButtonClass('correct')
		setTimeout(()=>setButtonClass(''),1000)
		if(Object.keys(fileContent).length<=0){setCurrentSet('')}
	}else{
		setButtonClass('wrong')
		setTimeout(()=>setButtonClass(''),1000)
		if(questionCounter<Object.keys(fileContent).length){setQuestionCounter(questionCounter+1)}
		
	}
	form.setValue('answer','')
}