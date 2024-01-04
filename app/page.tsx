"use client"
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import {SetGrid} from '@/components/setGrid'
import {Questioner} from '@/components/questioner'
import { useState } from 'react'

export default function Home() {
	let [currentSet,setCurrentSet]=useState('')
  return (
	<main>
		<section id="start">
		<ThemeToggle/>
			<h1 className='text-8xl'>TobyLearn</h1>
			<Button onClick={()=>{window.location.href="#choose-set"}}>Kies een Set</Button>
		</section>
		<section id='choose-set'>
<h1 className='absolute top-5 text-xl'>Kies een set</h1>
<SetGrid setCurrentSet={setCurrentSet}></SetGrid>
		</section>
		<section id='questioner'><Questioner currentSet={currentSet}></Questioner></section>
	</main>
  )
}
