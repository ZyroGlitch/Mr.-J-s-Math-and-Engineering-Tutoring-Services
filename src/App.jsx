import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from './Pages/Client/Landing'
import Enroll from './Pages/Client/Enroll'
import { Toaster } from '@/components/ui/sonner'
import Login from './Pages/Admin/Login'
import Dashboard from './Pages/Admin/Dashboard'
import Overview from './Pages/Admin/Content/Overview'
import Booking from './Pages/Admin/Content/Booking'
import Services from './Pages/Admin/Content/Services'
import Messages from './Pages/Admin/Content/Messages'
import AddBooking from './Pages/Admin/Content/Booking/AddBooking'
import Profile from './Pages/Admin/Content/Profile'
import Request from './Pages/Admin/Content/Booking/Request'
import Pending from './Pages/Admin/Content/Booking/Pending'
import Confirmed from './Pages/Admin/Content/Booking/Confirmed'
import Completed from './Pages/Admin/Content/Booking/Completed'
import UpdateBooking from './Pages/Admin/Content/Booking/EditBooking'
import EditBooking from './Pages/Admin/Content/Booking/EditBooking'

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Client Routes */}
          <Route path='/' element={<Landing />} />
          <Route path='/enroll' element={<Enroll />} />

          {/* Admin Routes */}
          <Route path='/admin-portal' element={<Login />} />
          <Route element={<Dashboard />}>
            <Route path='/admin-dashboard' element={<Overview />} />

            <Route path='/admin-booking' element={<Booking />} />
            <Route path='/admin-add-booking' element={<AddBooking />} />
            <Route path='/admin-edit-booking' element={<EditBooking />} />
            <Route path='/admin-request-booking' element={<Request />} />
            <Route path='/admin-pending-booking' element={<Pending />} />
            <Route path='/admin-confirmed-booking' element={<Confirmed />} />
            <Route path='/admin-completed-booking' element={<Completed />} />

            <Route path='/admin-services' element={<Services />} />
            <Route path='/admin-messages' element={<Messages />} />
            <Route path='/admin-profile' element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position='top-right' richColors closeButton />
    </>
  )
}
