'use client'
import { Button } from '@/components/ui/button'
import { Settings } from '@/components/settings'
import {SetGrid} from '@/components/setGrid'
import {Questioner} from '@/components/questioner'
import {useEffect, useState} from 'react'
import { Toaster } from '@/components/ui/toaster'
import { useTheme } from 'next-themes'
import { toast, useToast } from '@/components/ui/use-toast'
import { ArrowLeft } from 'lucide-react'
import { MakeSet } from '@/components/makeSet'
import { tauri } from '@tauri-apps/api'


export interface Isettings{
	accentColor:string,
	randomizeQuestions: boolean,
	caseSensitive:boolean
}

export default function Home() {
	const [setElements,setSetElements]=useState([''])
	const {toast}=useToast()
	const [currentSet,setCurrentSet]=useState('')
	const [settings,setSettings]=useState<Isettings>({accentColor:'none',randomizeQuestions:true,caseSensitive:true})
	const { setTheme } = useTheme()
	useEffect(()=>{
		import('@tauri-apps/api').then((tauri)=>{
			tauri.invoke<string>('get_settings').then((settings)=>{setSettings(JSON.parse(settings))}).catch((e)=>toast({variant:'destructive',title:'Error!',description:e}))
		})
	},[])
	useEffect(()=>{
		setTheme(settings.accentColor)
	},[settings])

	return (
		<main>
			<section id="start">
				<Settings settings={settings} setSettings={setSettings}/>
				<h1 className='text-8xl'>TobyLearn</h1>
				<Button asChild>
					<a href="#grid">Kies een Set</a>
				</Button>
			</section>
			<section id='choose-set' className='w-200vw flex justify-between flex-row'>
				<section id='grid' className='w-screen h-screen'>
					<Button asChild variant='ghost' className='absolute top-4 left-4'>
						<a href="#start"><ArrowLeft /></a>
					</Button>
					<h1 className='absolute top-5 text-xl'>Kies een set</h1>
					<SetGrid setCurrentSet={setCurrentSet} setElements={setElements} setSetElements={setSetElements}></SetGrid>
					<Button asChild className='absolute bottom-10 right-10 bg-green-500 hover:bg-green-300'>
						<a href='#make-grid'>+</a>
					</Button>
					<Button onClick={()=>importSet(setSetElements)} className='absolute bottom-10 right-10 bg-blue-500 hover:bg-blue-300'>Import</Button>
				</section>
				<section id='make-grid' className='w-screen h-screen'>
					<Button asChild variant='ghost' className='absolute top-4 left-4'>
						<a href="#grid"><ArrowLeft /></a>
					</Button>
					<h1 className='absolute top-5 text-xl'>Make Set</h1>
					<MakeSet setSetElements={setSetElements} />
				</section>
			</section>
			<section id='questioner'>
				<Button asChild variant='ghost' className='absolute top-4 left-4'><a href="#grid"><ArrowLeft /></a></Button>
				<Questioner currentSet={currentSet} settings={settings}></Questioner>
			</section>
			<Toaster />
		</main>
	)
}

function importSet(setSetElements:(arg0: string[])=>void){
	import('@tauri-apps/api/index').then((tauri)=>{
		tauri.invoke<string>('import_set').then((msg)=>{

			tauri.invoke<string>('get_all_sets').then((setsString)=>{
				const sets=setsString.split(',')
				setSetElements(sets)
			}).catch((e)=>toast({variant:'destructive',title:'Error!',description:e}))

			toast({title:'Imported set',description:msg})
		})})
}
