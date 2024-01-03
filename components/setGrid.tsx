import { Card ,CardHeader,CardTitle,CardFooter} from "@/components/ui/card";
import {invoke} from '@tauri-apps/api/tauri'
import { ReactElement, useState } from "react";

export function SetGrid(){
let [setElements,setSetElements]=useState([<></>])
invoke<string>('get_all_sets').then((setsString)=>{
	const sets=setsString.split(',')
 const setCardArray=sets.map((setName)=>

<Card key={setName}><CardHeader><CardTitle>{setName}</CardTitle></CardHeader></Card>
 )
 setSetElements(setCardArray)
})
return(
	<div className="grid auto-cols-fr auto-rows-fr grid-cols-2 gap-3 grow m-20">
		{setElements}
	</div>
)
}