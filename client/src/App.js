import React from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/pages/Home';
import Services from './components/pages/Services';
import Products from './components/pages/Products';
import SignUp from './components/pages/SignUp';
import Hotel from './components/searchServices/hotel/hotel';
import { HotelsContextProvider } from './context/HotelsContext';
import Info from './components/pages/Info';
import BookingInfo from './components/pages/BookingInfo';
import Admin from './components/pages/Admin';
import BookingDetail from './components/pages/BookingDetail';
import UpdateBookingDetail from './components/pages/UpdateBookingDetail';

function App() {
  return (
    <HotelsContextProvider>
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' exact element={<Home />} />
          <Route path='/services' element={<Services />} />
          <Route path='/products' element={<Products />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/hotel/:hotel_id/:room_class' element={<Hotel />} />
          <Route path = '/info' element={<Info/>}/>
          <Route path = '/booking-confirm' element={<BookingInfo/>}/>
          <Route path='/admin' element={<Admin/>}/>
          <Route path='/admin/booking/:booking_id' element={<BookingDetail/>}/>
          <Route path='/admin/booking/:booking_id/update' element={<UpdateBookingDetail/>}/>
        </Routes>
      </Router>
    </>
    </HotelsContextProvider>
  );
}

export default App;
