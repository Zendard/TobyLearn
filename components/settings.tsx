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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useTheme } from 'next-themes'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

  
  

export function Settings(){
	const { theme, setTheme } = useTheme()
	return(
		<Sheet>
			<SheetTrigger  className='absolute top-10 right-10 duration-100'><SettingsIcon /></SheetTrigger>
			<SheetContent className='flex flex-col h-full'>
				<SheetHeader>
					<SheetTitle>Settings</SheetTitle>
				</SheetHeader>
				<form onSubmit={()=>{setTheme('blue')}} className="flex flex-col h-full">
					<div className="grow py-1 flex flex-col gap-5">
						<fieldset className="flex justify-between">
							<Label htmlFor='accent-color'>Accent Color</Label>
							<RadioGroup className='flex' id='accent-color'>
								<RadioGroupItem value='white' className='border-white'/>
								<RadioGroupItem value='blue' className='border-blue-700'/>
								<RadioGroupItem value='red' className='border-red-700'/>
							</RadioGroup>
						</fieldset>
						<fieldset className="flex justify-between">
							<Label>Shuffle question order</Label>
							<Switch />
						</fieldset>
					</div>

					<SheetClose type='submit' className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2'>Save</SheetClose>
				</form>
			</SheetContent>
		</Sheet>

	)
}