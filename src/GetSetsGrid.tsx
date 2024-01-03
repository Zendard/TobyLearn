'use client'
import { ReactElement, useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api'

export default function getSetMenu() {
	const [sets, setSets] = useState('')

	useEffect(() => {
		invoke<string>('get_sets')
			.then((result) => setSets(JSON.parse(result)))
			.catch(console.error)
	})
	const setArray: ReactElement[] = []
	Object.keys(sets).forEach((setName) => {
		const div = (
			<div className="set" key={setName}>
				{setName}
			</div>
		)
		setArray.push(div)
	})
	return <div className="grid">{setArray}</div>
}
