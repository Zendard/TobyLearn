"use client"
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import {SetGrid} from '@/components/setGrid'

export default function Home() {
  return (
	<main>
		<section id="start">
		<ThemeToggle/>
			<h1 className='text-8xl'>TobyLearn</h1>
			<Button onClick={()=>{window.location.href="#choose-set"}}>Kies een Set</Button>
		</section>
		<section id='choose-set'>
<h1 className='absolute top-5 text-xl'>Kies een set</h1>
<SetGrid></SetGrid>
		</section>
	</main>
  )
}
