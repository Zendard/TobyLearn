'use client'
import { Button } from '@/components/ui/button'
import { Settings } from '@/components/settings'
import {SetGrid} from '@/components/setGrid'
import {Questioner} from '@/components/questioner'
import {useEffect, useState} from 'react'
import { Toaster } from '@/components/ui/toaster'
import { invoke } from '@tauri-apps/api'
import { useTheme } from 'next-themes'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft } from 'lucide-react'


export interface Isettings{
	accentColor:string,
	randomizeQuestions: boolean,
	caseSensitive:boolean
}

export default function Home() {
	const {toast}=useToast()
	const [currentSet,setCurrentSet]=useState('')
	const [settings,setSettings]=useState<Isettings>({accentColor:'none',randomizeQuestions:true,caseSensitive:true})
	const { setTheme } = useTheme()
	useEffect(()=>{
		invoke<string>('get_settings').then((settings)=>{setSettings(JSON.parse(settings))}).catch((e)=>toast({variant:'destructive',title:'Error!',description:e}))
	},[])
	useEffect(()=>{
		console.log(settings)
		setTheme(settings.accentColor)
	},[settings])

	return (
		<main>
			<section id="start">
				<Settings settings={settings} setSettings={setSettings}/>
				<h1 className='text-8xl'>TobyLearn</h1>
				<Button asChild><a href="#choose-set">Kies een Set</a></Button>
			</section>
			<section id='choose-set'>
				<Button asChild variant='ghost' className='absolute top-4 left-4'><a href="#start"><ArrowLeft /></a></Button>
				<h1 className='absolute top-5 text-xl'>Kies een set</h1>
				<SetGrid setCurrentSet={setCurrentSet}></SetGrid>
			</section>
			<section id='questioner'>
				<Button asChild variant='ghost' className='absolute top-4 left-4'><a href="#choose-set"><ArrowLeft /></a></Button>
				<Questioner currentSet={currentSet} settings={settings}></Questioner>
			</section>
			<Toaster />
		</main>
	)
}
