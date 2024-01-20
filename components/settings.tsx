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
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'


  
  

export function Settings(){
	const settingsSchema = z.object({
		accentColor: z.string(),
	})
	const form = useForm<z.infer<typeof settingsSchema>>({
		resolver: zodResolver(settingsSchema),
		defaultValues: {
			accentColor: 'red',
		},
	})

	function onSubmit(values: z.infer<typeof settingsSchema>) {
		console.log(values)
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
								<FormItem className='flex justify-between'>
									<FormLabel>Accent Color</FormLabel>
									<FormControl className='flex items-center'>
										<RadioGroup {...field}>
											<RadioGroupItem value='white' className='border-white'/>
											<RadioGroupItem value='blue' className='border-blue-700'/>
											<RadioGroupItem value='red' className='border-red-700'/>
										</RadioGroup>
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