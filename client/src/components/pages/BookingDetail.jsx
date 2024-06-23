import React, { useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import HotelFinder from '../../apis/HotelFinder';
import { HotelsContext } from '../../context/HotelsContext';

const BookingDetail = () => {
    const {booking_id} = useParams();
    const { selectedBooking, setSelectedBooking } = useContext(HotelsContext);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}/${month}/${year}`;
      }

    
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await HotelFinder.get(`/booking/detail/${booking_id}`);
            setSelectedBooking(response.data.data.booking[0]);
          } catch (err) { }
        };
        fetchData();
})
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        navigate(`/admin/booking/${booking_id}/update`);
      }



  return (
    <div className="container">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title display-center">Booking Information</h2>

          <div className="mb-4">
            <h4 className="mb-3">Customer Information</h4>
            <p>
              <strong>Full name:</strong> {selectedBooking && selectedBooking.customer_full_name}
            </p>
            <p>
              <strong>Email:</strong> {selectedBooking && selectedBooking.email}
            </p>
            <p>
              <strong>Phone Number:</strong> {selectedBooking && selectedBooking.phone}
            </p>
          </div>

          <div className="mb-4">
            <h4 className="mb-3">Room Information</h4>
            <p>
              <strong>Hotel Name:</strong> {selectedBooking && selectedBooking.hotel_name}
            </p>
            <p>
              <strong>Room Class:</strong> {selectedBooking && selectedBooking.room_class}
            </p>
            <p>
              <strong>Room Number:</strong> {selectedBooking && selectedBooking.room_number}
            </p>
          </div>

          <div className="mb-4">
            <h4 className="mb-3">Check-in Information</h4>
            <p>
              <strong>Check-in Date:</strong> {selectedBooking && formatDate(selectedBooking.check_in_date)}
            </p>
            <p>
              <strong>Check-out Date:</strong> {selectedBooking && formatDate(selectedBooking.check_out_date)}
            </p>
          </div>

          <div>
            <h4 className="mb-3">Price</h4>
            <p>
              <strong>Total Price:</strong> ${selectedBooking && selectedBooking.total_price}
            </p>
          </div>
          <button 
                onClick = {handleSubmit}
                type='submit'
                className="btn btn-warning btn-m text-center but">UPDATE</button>
        </div>
      </div>
    </div>
  )
}

export default BookingDetail
