import React from 'react'
import ReactDOM from 'react-dom/client'
import Start from './Start'
import ChooseSet from './ChooseSet'
import './styles/styles.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<Start />
		<ChooseSet />
	</React.StrictMode>
)
