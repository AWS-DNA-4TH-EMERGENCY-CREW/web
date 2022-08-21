import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
    )
}

export default App
