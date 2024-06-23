import React, { useContext, useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom';
import { HotelsContext } from '../../context/HotelsContext';
import HotelFinder from '../../apis/HotelFinder';
import { useNavigate } from 'react-router-dom';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}/${month}/${year}`;
}

const BookingList = () => {
  const { bookings, setBookings } = useContext(HotelsContext);
  let navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await HotelFinder.get('/bookings');
        console.log(response.data.data.booking);
        setBookings(response.data.data.booking);
      } catch (err) { }
    };
    fetchData();
  }, [setBookings]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
        const response = await HotelFinder.delete(`/${id}`);
        console.log(response)
        setBookings(bookings.filter(bookings => {
            return bookings.booking_id !== id;
        }
    ))
    } catch (err) {}
};

const handleBookingSelect = (id) => {
    navigate(`/admin/booking/${id}`);
};

  return (
    <div className='list-group '>
      <table className="table table-hover table-dark">
        <thead className='text-center'>
          <tr className="bg-primary">
            <th scope="col">Booking ID</th>
            <th scope="col">Customer</th>
            <th scope="col">Hotel</th>
            <th scope="col">Room Number</th>
            <th scope="col">Check-in</th>
            <th scope="col">Check-out</th>
            <th scope="col">Total</th>
            {/* <th scope="col">Edit</th> */}
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody className='text-center'>
          {bookings && bookings.map(bookings => {
            return (
              <tr onClick={() => handleBookingSelect(bookings.booking_id)} key={bookings.booking_id}>
                <td>{bookings.booking_id}</td>
                <td>{bookings.customer_full_name}</td>
                <td>{bookings.hotel_name}</td>
                <td>{bookings.room_number}</td>
                <td>{formatDate(bookings.check_in_date)}</td>
                <td>{formatDate(bookings.check_out_date)}</td>
                <td>${bookings.total_price}</td>
                {/* <td><button className="btn btn-warning">Update</button></td> */}
                <td><button 
                    className="btn btn-danger"
                    onClick={(e) => handleDelete(e, bookings.booking_id)} >Delete</button></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default BookingList