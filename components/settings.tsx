import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { SettingsIcon } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useToast} from '@/components/ui/use-toast'
import { useTheme } from 'next-themes'
import { Separator } from '@/components/ui/separator'
import { Isettings } from '@/app/page'
import { Dispatch, SetStateAction } from 'react'
  
  

export function Settings({settings,setSettings}:{settings:Isettings,setSettings:Dispatch<SetStateAction<Isettings>>}){
	const {setTheme}=useTheme()
	const {toast}=useToast()

	const settingsSchema = z.object({
		accentColor: z.string().catch(settings.accentColor),
		randomizeQuestions: z.boolean().catch(settings.randomizeQuestions),
		caseSensitive: z.boolean().catch(settings.caseSensitive)
	})
	const form = useForm<z.infer<typeof settingsSchema>>({
		resolver: zodResolver(settingsSchema),
	})

	function onSubmit(values: z.infer<typeof settingsSchema>) {
		console.log(values)
		import('@tauri-apps/api/index').then((tauri)=>{
			tauri.invoke<string>('save_settings',{'settings':JSON.stringify(values)}).then((successString)=>{
				toast({title:successString})
				setTheme(values['accentColor'])
				tauri.invoke<string>('get_settings').then((settings)=>{
					settingsSchema.catchall(JSON.parse(settings))
					setSettings(JSON.parse(settings))
				})
			})})}

	return(
		<Sheet>
			<SheetTrigger  className='absolute top-10 right-10 duration-100'><Button variant={'ghost'} asChild>
				<SettingsIcon />
			</Button></SheetTrigger>
			<SheetContent className='flex flex-col h-full'>
				<SheetHeader>
					<SheetTitle>Settings</SheetTitle>
				</SheetHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="h-dvh flex flex-col overflow-y-auto gap-2">
						<FormField
							control={form.control}
							name="accentColor"
							render={({ field }) => (
								<FormItem className='flex justify-between items-center'>
									<FormLabel>Theme</FormLabel>
									<FormControl className='flex items-center'>
										<RadioGroup onValueChange={field.onChange} defaultValue={settings.accentColor}>
											<RadioGroupItem value='white' className='border-white'/>
											<RadioGroupItem value='blue' className='border-blue-700'/>
											<RadioGroupItem value='purple' className='border-purple-700'/>
											<RadioGroupItem value='green' className='border-green-700'/>
											<RadioGroupItem value='red' className='border-red-700'/>
											<RadioGroupItem value='orange' className='border-orange-700'/>
										</RadioGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Separator className='my-2'/>
						<FormField
							control={form.control}
							name="randomizeQuestions"
							render={({ field }) => (
								<FormItem className='flex justify-between items-center'>
									<FormLabel>Randomize questions?</FormLabel>
									<FormControl className='flex items-center'>
										<Switch checked={field.value} defaultChecked={settings.randomizeQuestions} onCheckedChange={field.onChange}/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="caseSensitive"
							render={({ field }) => (
								<FormItem className='flex justify-between items-center'>
									<FormLabel>Case sensitive?</FormLabel>
									<FormControl className='flex items-center'>
										<Switch checked={field.value} defaultChecked={settings.caseSensitive} onCheckedChange={field.onChange}/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<SheetClose asChild><Button type="submit">Submit</Button></SheetClose>
					</form>
				</Form>
				
			</SheetContent>
		</Sheet>

	)
}