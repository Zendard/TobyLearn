import { Card ,CardHeader,CardTitle} from '@/components/ui/card'
import {invoke} from '@tauri-apps/api/tauri'
import {useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export function SetGrid({setCurrentSet}:{setCurrentSet:(arg0: string)=>void}){
	const [setElements,setSetElements]=useState([''])
	useEffect(()=>{
		invoke<string>('get_all_sets').then((setsString)=>{
			const sets=setsString.split(',')
			setSetElements(sets)
		}).catch(console.log)},[])
	if(setElements.length<=0 || setElements[0]=='' || !setElements){
		return (<h1 className='text-3xl'>Geen sets gevonden</h1>)
	}
	return(
		<div key={'grid'} className="grid auto-cols-fr auto-rows-fr grid-cols-2 gap-3 grow m-20">
			{setElements.map((setName)=>{
				return (<Card key={'card-'+setName} className="cursor-pointer" onClick={()=>{setCurrentSet(setName); window.location.href = '#questioner'}}><CardHeader><CardTitle>{setName}</CardTitle></CardHeader></Card>)
			})}
		</div>
	)
}