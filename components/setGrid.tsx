import { Card ,CardHeader,CardTitle} from '@/components/ui/card'
import {invoke} from '@tauri-apps/api/tauri'
import {useState } from 'react'

export function SetGrid({setCurrentSet}:{setCurrentSet:(arg0: string)=>void}){
	const [setElements,setSetElements]=useState([<></>])
	invoke<string>('get_all_sets').then((setsString)=>{
		const sets=setsString.split(',')
		const setCardArray=sets.map((setName)=>{
			return (<Card key={setName} className="cursor-pointer" onClick={()=>{setCurrentSet(setName); window.location.href = '#questioner'}}><CardHeader key={setName+'-header'}><CardTitle key={setName+'-title'}>{setName}</CardTitle></CardHeader></Card>)
		})
		setSetElements(setCardArray)
	})
	return(
		<div className="grid auto-cols-fr auto-rows-fr grid-cols-2 gap-3 grow m-20">
			{setElements}
		</div>
	)
}