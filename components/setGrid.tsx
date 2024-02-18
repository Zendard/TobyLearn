import { Card ,CardContent,CardFooter,CardHeader,CardTitle} from '@/components/ui/card'
import {useEffect} from 'react'
import { toast } from '@/components/ui/use-toast'
import {LucideArrowLeftRight, LucideEdit2, LucideMoreVertical, LucideShare, LucideTrash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import {Popover,PopoverContent,PopoverTrigger} from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { Separator } from './ui/separator'

export function SetGrid({setCurrentSet,setElements,setSetElements,setEditSetContent,setEditSetTitle}:{setCurrentSet:(arg0: string)=>void,setElements:string[],setSetElements:(arg0: string[])=>void,setEditSetContent:(arg0:{[key:string]:string})=>void,setEditSetTitle:(arg0:string)=>void}){
	
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
						<Card key={'card-'+setName} className="cursor-pointer hover:bg-white/10 w-48 h-full" onClick={()=>{setCurrentSet(setName); window.location.href='#questioner'}}>
							<CardHeader className='flex flex-row justify-between items-center'>
								<CardTitle >{setName}</CardTitle>
								<Popover>
									<PopoverTrigger asChild className='flex justify-end'><Button className=' hover:bg-zinc-500' variant={'ghost'} onClick={(e)=>e.stopPropagation()}><LucideMoreVertical/></Button></PopoverTrigger>
									<PopoverContent className='w-full flex flex-col gap-1 justify-center'>
										<Label className=' text-lg font-bold'>{setName}</Label>
										<Button variant={'ghost'} className='w-full justify-start flex gap-3 text-md px-3 py-0' onClick={()=>editSet(setName,setEditSetContent,setEditSetTitle)}><a href="#make-grid" className='w-full p-0 m-0 justify-start flex gap-3 text-md'><LucideEdit2 strokeWidth={3} size={'1.3em'}/>Edit </a> </Button>
										<Button variant={'ghost'} className='w-full justify-start flex gap-3 text-md px-3 py-0' onClick={(e)=>{e.stopPropagation(); reverseSet(setName)}}><LucideArrowLeftRight/>Reverse</Button>
										<Button variant={'ghost'} className='justify-start flex gap-3 text-md px-3 py-0' onClick={(e)=>{e.stopPropagation(); exportSet(setName)}}><LucideShare size={'1.3em'}/>Export</Button>
										<Separator />
										<Button variant={'ghost'} className='justify-start px-3 py-0' onClick={(e)=>e.stopPropagation()}><DialogTrigger  asChild><div className=' text-red-600 flex gap-3 text-md'><LucideTrash2 stroke='red' size={'1.3em'} /> Delete</div ></DialogTrigger></Button>
									</PopoverContent>
								</Popover>
							</CardHeader>
							<CardContent >
							</CardContent>
							<CardFooter className='flex justify-end' >
								
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
	import('@tauri-apps/api/index').then((tauri)=>{
		tauri.invoke<string>('export_set',{setName})
			.then((msg)=>toast({title:'Exported set',description:msg}))
			.catch((e)=>{toast({variant:'destructive',title:'Error!',description:e})})
	})
}

function editSet(setName:string,setEditSetContent:(arg0:{[key:string]:string})=>void,setEditSetTitle:(arg0:string)=>void){
	import('@tauri-apps/api/index').then((tauri)=>{
		tauri.invoke<string>('get_file_content',{fileString:setName})
			.then((setContent)=>{
				setEditSetContent(JSON.parse(setContent))
				setEditSetTitle(setName)
			})
			.catch((e)=>{toast({variant:'destructive',title:'Error!',description:e})})
	})
}

function reverseSet(setName:string){
	import('@tauri-apps/api/index').then((tauri)=>{
		tauri.invoke<string>('reverse_set',{setName})
			.then((msg)=>{
				toast({title:'Reversed set',description:msg})
			})
			.catch((e)=>{toast({variant:'destructive',title:'Error!',description:e})})
	})
}