import { Card ,CardHeader,CardTitle} from '@/components/ui/card'
import {invoke} from '@tauri-apps/api/tauri'
import {useState } from 'react'

export function SetGrid({setCurrentSet}:{setCurrentSet:(arg0: string)=>void}){
	const [setElements,setSetElements]=useState([''])
	invoke<string>('get_all_sets').then((setsString)=>{
		const sets=setsString.split(',')
		setSetElements(sets)
	})
	return(
		<div key={'grid'} className="grid auto-cols-fr auto-rows-fr grid-cols-2 gap-3 grow m-20">
			{setElements.map((setName)=>{
				return (<Card key={'card-'+setName} className="cursor-pointer" onClick={()=>{setCurrentSet(setName); window.location.href = '#questioner'}}><CardHeader><CardTitle>{setName}</CardTitle></CardHeader></Card>)
			})}
		</div>
	)
}