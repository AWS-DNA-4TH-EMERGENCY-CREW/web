import React from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import { AmplifyProvider } from '@aws-amplify/ui-react'
import config from './aws-exports'
import reportWebVitals from './reportWebVitals'
import '@aws-amplify/ui-react/styles.css'
import './reset.css'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App'


Amplify.configure(config)
const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)

root.render(
    <React.StrictMode>
        <AmplifyProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </AmplifyProvider>
    </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
