import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from './Pages/Client/Landing'
import Enroll from './Pages/Client/Enroll'
import { Toaster } from '@/components/ui/sonner'

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/enroll' element={<Enroll />} />
        </Routes>
      </BrowserRouter>
      <Toaster position='top-right' richColors closeButton />
    </>
  )
}
