import * as z from 'zod'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import {UseFormReturn, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import {LucideX } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'


const FormSchema = z.object({
	title:z.string().min(3)
}).catchall(z.string())

export function MakeSet({setSetElements}:{setSetElements:(arg0:string[])=>void}){
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema)
	})

	const [itemCounter,setItemCounter]=useState(1)
	const [fieldArray,setFieldArray]=useState([<div key={0}/>])
	useEffect(()=>{
		setFieldArray(generateFields(itemCounter,setItemCounter,form))
	},[itemCounter])
	return(
		<div className="form">
			<Form {...form}>
				<form className="flex flex-col gap-3" onSubmit={
					form.handleSubmit((formdata)=>saveSet(formdata,setSetElements))
				}>
					<FormField
						defaultValue=''
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input placeholder="Set title" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<ScrollArea className='formScroll'>
						<div className='p-4'>{fieldArray}</div>
					</ScrollArea>
					<Button>Ok</Button>
				</form>
			</Form>
		</div>
	)
}

function generateFields(itemCounter:number, setItemCounter: Dispatch<SetStateAction<number>>,form:UseFormReturn<z.objectOutputType<{title: z.ZodString;}, z.ZodString, 'strip'>, undefined>){
	const itemArray=[]
	for(let i=0;i<itemCounter-1;i++){
		itemArray.push(fieldElement(i,false,setItemCounter,form))
	}
	itemArray.push(fieldElement(itemCounter-1,true,setItemCounter,form))
	return itemArray
}

function fieldElement(counter:number, last:boolean, setItemCounter: { (value: SetStateAction<number>): void; (value: SetStateAction<number>): void },form:UseFormReturn<z.objectOutputType<{title: z.ZodString;}, z.ZodString, 'strip'>, undefined>){
	return(
		<fieldset className='flex gap-3 mt-3' key={counter}>
			<FormField
				defaultValue=''
				control={form.control}
				name={`q-${counter}`}
				render={({ field }) => (
					<FormItem>
						<FormControl>
							<Input placeholder="Question" onInput={()=>{
								if(!last) return
								setItemCounter(counter+2)
							}
							} {...field} />
						</FormControl>
					</FormItem>
				)}
			/>
			<FormField
				defaultValue=''
				control={form.control}
				name={`a-${counter}`}
				render={({ field }) => (
					<FormItem>
						<FormControl>
							<Input placeholder="Answer" {...field} />
						</FormControl>
					</FormItem>
				)}
			/>
			{counter!=0 && last &&
				<Button variant={'ghost'} tabIndex={999999} onClick={()=>{setItemCounter(counter)}}><LucideX /></Button>
			}
		</fieldset>
	)
}

interface Iformdata{
	title:string
	[questionAnswer:string]:string
}

function saveSet(formdata:Iformdata, setSetElements: ((arg0: string[]) => void)){
	const title =formdata['title']
	delete formdata[title]
	const questions: string[] = []
	Object.keys(formdata).forEach((key)=>{
		if(!key.startsWith('q-')) return
		questions.push(formdata[key])
	})
	const answers: string[] = []
	Object.keys(formdata).forEach((key)=>{
		if(!key.startsWith('a-')) return
		answers.push(formdata[key])
	})

	const json:{[question:string]:string}= {}
	for(let i=0;i<questions.length;i++){
		if(questions[i].length>0 && answers[i].length>0){
			json[questions[i]]=answers[i]
		}
	}
	console.log(title)
	console.log(json)
	import('@tauri-apps/api/index').then((tauri)=>{
		tauri.invoke<string>('save_set',{title:title,json:JSON.stringify(json)})
			.then((msg)=>{
				window.location.href='#grid'
				import('@tauri-apps/api/index').then((tauri)=>{
					tauri.invoke<string>('get_all_sets')
						.then((setsString)=>{
							const sets=setsString.split(',')
							setSetElements(sets)
						})
						.catch((e)=>toast({variant:'destructive',title:'Error!',description:e}))})
				toast({title:'Saved set!',description:msg})
			})
			.catch((e)=>toast({
				variant:'destructive',title:'Error!',description:e
			}))})
}