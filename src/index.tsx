import React from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import { AmplifyProvider } from '@aws-amplify/ui-react'
import config from './aws-exports'
import reportWebVitals from './reportWebVitals'
import '@aws-amplify/ui-react/styles.css'
import './reset.css'
import './index.css'
import { BrowserRouter, Link } from 'react-router-dom'
import App from './App'


Amplify.configure(config)
const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)

root.render(
    <React.StrictMode>
        <AmplifyProvider>
            <BrowserRouter>
                <div style={{
                    position: 'fixed',
                    width: '100%',
                    display: 'flex',
                    marginTop: '8px',
                    marginLeft: '1.5rem',
                    padding: '10px 25px 25px 10px'
                }}>
                    <Link to="/" style={{
                        display: 'flex', justifyContent: 'flex-start',
                        alignItems: 'center',
                    }}>
                        <div style={{ color: '#d85c27', fontSize: '1.5rem', lineHeight: '1.25rem', fontWeight: 'bold' }}>Emergency</div>
                        <div style={{
                            color: 'black',
                            fontSize: '0.9rem',
                            lineHeight: '0.9rem',
                            fontWeight: 'normal',
                            paddingLeft: '0.3rem',
                            marginTop: '12px'
                        }}>Time
                        </div>
                    </Link>
                </div>
                <div style={{ paddingTop: '62px', height:"100%" }}>
                    <App />
                </div>
            </BrowserRouter>
        </AmplifyProvider>
    </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
