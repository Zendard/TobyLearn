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


export interface Isettings{
	accentColor:string,
	randomizeQuestions: boolean,
	caseSensitive:boolean,
	accentSensitive:boolean,
	showAnswer:boolean
}

export default function Home() {
	const [setElements,setSetElements]=useState([''])
	const {toast}=useToast()
	const [currentSet,setCurrentSet]=useState('')
	const [settings,setSettings]=useState<Isettings>({accentColor:'none',randomizeQuestions:true,caseSensitive:true,accentSensitive:true,showAnswer:true})
	const { setTheme } = useTheme()
	const [editSetContents,setEditSetContent]=useState<{[key:string]:string}>({'':''})
	const [editSetTitle,setEditSetTitle]=useState('')

	useEffect(()=>{
		import('@tauri-apps/api').then(function (tauri) {
			tauri.invoke<string>('get_settings').then((settings) => { setSettings(JSON.parse(settings)) }).catch((e) => toast({ variant: 'destructive', title: 'Error!', description: e }))
			tauri.invoke('check_update')
		})
	},[])
	useEffect(()=>{
		setTheme(settings.accentColor)
	},[settings])

	useEffect(()=>{
		window.addEventListener('resize',()=>{
			const currentAnchor=window.location.href.split('/')[window.location.href.split('/').length-1].replace('#','')
			console.log(document.getElementById(currentAnchor))
			document.getElementById(currentAnchor)?.scrollIntoView(true)
		})
	},[])
	return (
		<main>
			<section id="start">
				<Settings settings={settings} setSettings={setSettings}/>
				<h1 className='text-8xl'>TobyLearn</h1>
				<Button asChild>
					<a href="#grid">Choose a set</a>
				</Button>
			</section>
			<section id='choose-set' className='w-200vw flex justify-between flex-row'>
				<section id='grid' className='w-screen h-screen'>
					<Button asChild variant='ghost' className='absolute top-4 left-4'>
						<a href="#start"><ArrowLeft /></a>
					</Button>
					<h1 className='absolute top-5 text-xl'>Choose a set</h1>
					<SetGrid setCurrentSet={setCurrentSet} setElements={setElements} setSetElements={setSetElements} setEditSetContent={setEditSetContent} setEditSetTitle={setEditSetTitle}></SetGrid>
					<Button onClick={()=>{setEditSetContent({}); setEditSetTitle('')}}  asChild className='absolute bottom-10 right-10 bg-green-500 hover:bg-green-300'>
						<a href='#make-grid'>+</a>
					</Button>
					<Button onClick={()=>importSet(setSetElements)} className='absolute bottom-10 right-24 bg-blue-500 hover:bg-blue-300'>Import</Button>
				</section>
				<section id='make-grid' className='w-screen h-screen'>
					<h1 className='absolute top-5 text-xl'>Make Set</h1>
					<MakeSet setSetElements={setSetElements} defaultValues={editSetContents} defaultTitle={editSetTitle} />
				</section>
			</section>
			<section id='questioner'>
				<Button asChild variant='ghost' className='absolute top-4 left-4'><a href="#grid"><ArrowLeft /></a></Button>
				<Questioner currentSet={currentSet} settings={settings} setCurrentSet={setCurrentSet}></Questioner>
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
