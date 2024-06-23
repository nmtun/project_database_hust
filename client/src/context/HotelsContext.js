import React, { useState, createContext } from "react";
// import { format } from 'date-fns';
export const HotelsContext = createContext();

export const HotelsContextProvider = (props) => {
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState([]);
  const [selectedHotels, setSelectedHotel] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedRoomClass, setSelectedRoomClass] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState([]);
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const addHotels = (hotel) => {
    setHotels([...hotels, hotel]);
  };
  return (
    <HotelsContext.Provider
      value={{
        hotels, setHotels,
        addHotels,
        selectedHotels, setSelectedHotel,
        selectedUser, setSelectedUser,
        date, setDate,
        selectedRoomClass, setSelectedRoomClass,
        selectedRoom, setSelectedRoom,
        bookings, setBookings,
        selectedBooking, setSelectedBooking

      }}
    >
      {props.children}
    </HotelsContext.Provider>
  );
};