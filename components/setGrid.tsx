import { Card ,CardHeader,CardTitle} from '@/components/ui/card'
import {useEffect, useState } from 'react'
import { toast } from '@/components/ui/use-toast'

export function SetGrid({setCurrentSet}:{setCurrentSet:(arg0: string)=>void}){
	const [setElements,setSetElements]=useState([''])
	useEffect(()=>{
		import('@tauri-apps/api/index').then((tauri)=>{
			tauri.invoke<string>('get_all_sets').then((setsString)=>{
				const sets=setsString.split(',')
				setSetElements(sets)
			}).catch((e)=>toast({variant:'destructive',title:'Error!',description:e}))})},[])
	if(setElements.length<=0 || setElements[0]=='' || !setElements){
		return (<h1 className='text-3xl'>Geen sets gevonden</h1>)
	}
	return(
		<div key={'grid'} className="grid auto-cols-fr auto-rows-fr grid-cols-2 gap-3 grow m-20">
			{setElements.map((setName)=>{
				return (<a href="#questioner" key={'anchor-'+setName} className='h-full w-full'>
					<Card key={'card-'+setName} className="cursor-pointer hover:bg-white/10 h-full w-full" onClick={()=>{setCurrentSet(setName)}}><CardHeader><CardTitle>{setName}</CardTitle></CardHeader></Card>
				</a>)
			})}
		</div>
	)
}