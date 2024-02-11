import { Card ,CardContent,CardFooter,CardHeader,CardTitle} from '@/components/ui/card'
import {useEffect} from 'react'
import { toast } from '@/components/ui/use-toast'
import { LucideShare, LucideX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog'

export function SetGrid({setCurrentSet,setElements,setSetElements}:{setCurrentSet:(arg0: string)=>void,setElements:string[],setSetElements:(arg0: string[])=>void}){
	
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
				return (
					<Dialog key={'dialog-'+setName}>
						<Card key={'card-'+setName} className="cursor-pointer hover:bg-white/10 w-full h-fit">
							<CardHeader className='flex flex-row items-center justify-between gap-5'>
								<CardTitle onClick={()=>{setCurrentSet(setName); window.location.href='#questioner'}} >{setName}</CardTitle>
								<DialogTrigger asChild><Button className=' z-10' variant={'destructive'}><LucideX /></Button></DialogTrigger>
							</CardHeader>
							<CardContent onClick={()=>{setCurrentSet(setName); window.location.href='#questioner'}} />
							<CardFooter className='flex justify-end' onClick={()=>{setCurrentSet(setName); window.location.href='#questioner'}}>
								<Button onClick={()=>exportSet(setName)}><LucideShare/></Button>
							</CardFooter>
						</Card>
						<DialogContent>
							<DialogHeader><h1 className=' text-xl'>Are you sure you want to delete <b>{setName}</b>?</h1></DialogHeader>
							<DialogDescription>This action cannot be undone.</DialogDescription>
							<DialogFooter>
								<Button variant={'destructive'} onClick={()=>deleteSet(setName,setSetElements)}>Confirm</Button>
								<DialogClose>Cancel</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				)
			})}
		</div>
	)
}

function deleteSet(setName:string,setSetElements:(arg0:string[])=>void){
	window.location.href='#grid'
	import('@tauri-apps/api/index').then((tauri)=>{
		tauri.invoke<string>('delete_set',{setName:setName}).then((msg)=>{
			toast({title:'Deleted set',description:msg})

			tauri.invoke<string>('get_all_sets').then((setsString)=>{
				const sets=setsString.split(',')
				setSetElements(sets)
			}).catch((e)=>toast({variant:'destructive',title:'Error!',description:e}))})
	}).catch((e)=>toast({variant:'destructive',title:'Error!',description:e}))
}

function exportSet(setName:string){
	window.location.href='#grid'
	import('@tauri-apps/api/index').then((tauri)=>{
		tauri.invoke<string>('export_set',{setName}).then((msg)=>toast({title:'Exported set',description:msg}))
			.catch((e)=>{toast({variant:'destructive',title:'Error!',description:e})})
	})
}