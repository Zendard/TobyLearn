import {
	Sheet,
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
import {invoke} from '@tauri-apps/api/tauri'


  
  

export function Settings(){

	const settingsSchema = z.object({
		accentColor: z.string(),
		randomizeQuestions: z.boolean()
	})
	const form = useForm<z.infer<typeof settingsSchema>>({
		resolver: zodResolver(settingsSchema),
		defaultValues: {
			accentColor: 'red',
			randomizeQuestions: true
		},
	})

	function onSubmit(values: z.infer<typeof settingsSchema>) {
		console.log(values)
		invoke<string>('save_settings')
	}

	return(
		<Sheet>
			<SheetTrigger  className='absolute top-10 right-10 duration-100'><SettingsIcon /></SheetTrigger>
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
										<RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
											<RadioGroupItem value='white' className='border-white'/>
											<RadioGroupItem value='blue' className='border-blue-700'/>
											<RadioGroupItem value='red' className='border-red-700'/>
										</RadioGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="randomizeQuestions"
							render={({ field }) => (
								<FormItem className='flex justify-between items-center'>
									<FormLabel>Randomize questions?</FormLabel>
									<FormControl className='flex items-center'>
										<Switch checked={field.value} onCheckedChange={field.onChange}/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit">Submit</Button>
					</form>
				</Form>
				
			</SheetContent>
		</Sheet>

	)
}