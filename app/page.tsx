'use client'
import { Button } from '@/components/ui/button'
import { Settings } from '@/components/settings'
import {SetGrid} from '@/components/setGrid'
import {Questioner} from '@/components/questioner'
import {useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'


export default function Home() {
	const [error,setError]=useState('')
	const [currentSet,setCurrentSet]=useState('')
	return (
		<main>
			<section id="start">
				<Settings/>
				<h1 className='text-8xl'>TobyLearn</h1>
				<Button onClick={()=>{window.location.href='#choose-set'}}>Kies een Set</Button>
			</section>
			<section id='choose-set'>
				<h1 className='absolute top-5 text-xl'>Kies een set</h1>
				<SetGrid setCurrentSet={setCurrentSet}></SetGrid>
			</section>
			<section id='questioner'><Questioner currentSet={currentSet} setError={setError}></Questioner></section>
			<ShowError error={error} />
		</main>
	)
}

export function ShowError({error}:{error:string}){
	if(error.length<=0){
		return
	}
	console.log(error)
	const {toast}=useToast()
	useEffect(()=>{
		toast({
			variant:'destructive',
			title: 'Error!',
			description: error,
		})},[error])
	return <Toaster />
}
