import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Broadcast from './pages/broadcast/Broadcast'
import Map from './pages/map/Map'

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Map />} />
            <Route path="/broadcast" element={<Broadcast />} />
            <Route path="/map" element={<Map />} />
        </Routes>
    )
}

export default App
