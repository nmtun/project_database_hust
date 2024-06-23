import React, { useContext } from 'react'
import { HotelsContext } from '../../context/HotelsContext';
import { format,differenceInDays, parse, add } from 'date-fns';
import UserFinder from '../../apis/UserFinder';
import {  useNavigate } from 'react-router-dom';
// import './BookingInfo.css';

const BookingInfo = () => {
  let navigate = useNavigate();

  const {date} = useContext(HotelsContext);
  const formattedStartDate = format(date[0].startDate, 'dd/MM/yyyy');
  const formattedEndDate = format(date[0].endDate, 'dd/MM/yyyy');

  const startDate = add(parse(formattedStartDate, 'dd/MM/yyyy', new Date()), { days: 1 });
  const endDate = add(parse(formattedEndDate, 'dd/MM/yyyy', new Date()), { days: 1 });
  const quantity = differenceInDays(endDate, startDate);
  
  console.log(quantity);
  const {selectedHotels} = useContext(HotelsContext);
  const {selectedUser, setSelectedUser} = useContext(HotelsContext);
  // const {selectedRoomClass, setSelectedRoomClass} = useContext(HotelsContext);
  const {selectedRoom} = useContext(HotelsContext);

  const total_price = quantity * selectedRoom.room_price;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await UserFinder.post("/booking", {
        customer_id:selectedUser.customer_id,
        hotel_id: selectedHotels.hotel_id,
        room_id: selectedRoom.room_id,
        dayStart: startDate,
        dayEnd: endDate,
        total_price
      })
    //   addHotels(response.data.data.hotel)
      setSelectedUser(response.data.data.users);
      console.log(response);
      
    } catch (err) {
        console.log(err);
    }
    navigate(`/`);
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title display-center">Booking Confirmation</h2>

          <div className="mb-4">
            <h4 className="mb-3">Customer Information</h4>
            <p>
              <strong>First Name:</strong> {selectedUser && selectedUser.first_name}
            </p>
            <p>
              <strong>Last Name:</strong> {selectedUser && selectedUser.last_name}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser && selectedUser.email}
            </p>
            <p>
              <strong>Phone Number:</strong> {selectedUser && selectedUser.phone}
            </p>
          </div>

          <div className="mb-4">
            <h4 className="mb-3">Room Information</h4>
            <p>
              <strong>Hotel Name:</strong> {selectedHotels.hotel_name}
            </p>
            <p>
              <strong>Room Class:</strong> {selectedRoom.room_class}
            </p>
            <p>
              <strong>Room Number:</strong> {selectedRoom.room_number}
            </p>
          </div>

          <div className="mb-4">
            <h4 className="mb-3">Check-in Information</h4>
            <p>
              <strong>Check-in Date:</strong> {formattedStartDate}
            </p>
            <p>
              <strong>Check-out Date:</strong> {formattedEndDate}
            </p>
          </div>

          <div>
            <h4 className="mb-3">Price</h4>
            <p>
              <strong>Total Price:</strong> ${total_price}
            </p>
          </div>
        </div><button onClick = {handleSubmit} type='submit' className="btn btn-m text-center abutton">CONFIRM</button>
      </div>
    </div>
    
  );
};
export default BookingInfo
