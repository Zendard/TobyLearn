import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { invoke } from '@tauri-apps/api'
import { useState,useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

export function Questioner({currentSet,setError}:{currentSet:string,setError:(arg0: string)=>void}){
	const [fileContent,setFileContent]=useState({'question':'answer'})
	useEffect(()=>{
		GetSet(currentSet,setError,setFileContent)
	},[currentSet])
	const [questionCounter,setQuestionCounter]=useState(0)

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			answer: '',
		},
	})
	
	return(
		<div className="questioner flex flex-col gap-5">
			<h1 id="question" className="text-7xl">{Object.keys(fileContent)[questionCounter]}</h1>
			<Form {...form}>
				<form className="flex gap-3" onSubmit={form.handleSubmit((data)=>checkAnswer(questionCounter,data))}>
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
					<Button>Ok</Button>
				</form>
			</Form>
		</div>
	)
}
function GetSet(currentSet:string,setError:(arg0: string)=>void, setFileContent){
	if (currentSet.length<=0) return

	invoke<string>('get_file_content',{'fileString':currentSet+'.tl'}).then((fileContent)=>{
		const JSONFile= JSON.parse(fileContent)
		setFileContent(JSONFile)
	}).catch(setError)

}

const FormSchema = z.object({
	answer: z.string(),
})

function checkAnswer(questionCounter:number,data: z.infer<typeof FormSchema>){
	console.log(data)
	console.log()
}