import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from './Pages/Client/Landing'

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}
