'use client'
import { ReactElement, useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api'

function App(setName: string) {
	const [setContent, setSetContent] = useState('')

	useEffect(() => {
		invoke<string>('get_file_content', { setName })
			.then((result) => setSetContent(JSON.parse(result)))
			.catch(console.error)
	})
}

export default App
