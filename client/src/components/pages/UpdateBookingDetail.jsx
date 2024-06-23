import React, { useContext, useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import HotelFinder from '../../apis/HotelFinder';
import { HotelsContext } from '../../context/HotelsContext';
import { add, differenceInDays, format, parse } from 'date-fns';

const UpdateBookingDetail = () => {
    const {booking_id} = useParams();
    const { selectedBooking, setSelectedBooking } = useContext(HotelsContext);
    const [formData, setFormData] = useState({});
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
        
        const checkInDate = formatDate(formData.check_in_date);
        const checkOutDate = formatDate(formData.check_out_date);
        const quantity = differenceInDays(checkInDate, checkOutDate);
        // const total_price = quantity * selectedBooking.room_price;
        // console.log(selectedBooking.room_price)
    let navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await HotelFinder.get(`/booking/detail/${booking_id}`);
            setSelectedBooking(response.data.data.booking[0]);
            setFormData(response.data.data.booking[0]);
          } catch (err) { }
        };
        fetchData();
    }, [booking_id, setSelectedBooking]);

    const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            
            const response = await HotelFinder.put(`/booking/detail/${booking_id}/update`, {
                first_name: formData.first_name,
                last_name: formData.last_name,
                customer_id: selectedBooking.customer_id,
                email: formData.email,
                phone: formData.phone,
                check_in_date: checkInDate, // Convert to Unix timestamp in seconds
                check_out_date: checkOutDate,
                total_price: selectedBooking.total_price
                // total_price
            });
            setSelectedBooking(response.data.data.booking);
            console.log(checkInDate)
            console.log(checkOutDate)
            // Show a success message or do something else after successful update
        } catch (err) {
            console.error(err);
            // Show an error message
        }
        navigate(`/admin/booking/${booking_id}`);
    };

    return (
        <div className="container">
            <div className="card">
                <div className="card-body">
                    <h2 className="card-title display-center">Booking Information</h2>

                    <form action='' className='inputs'>
                        <div className="mb-4">
                            <h4 className="mb-3">Customer Information</h4>
                            <div className="form-group">
                                <label htmlFor="first_name">First name:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="first_name"
                                    name="first_name"
                                    value={formData.first_name || ''}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="last_name">Last name:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="last_name"
                                    name="last_name"
                                    value={formData.last_name || ''}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    value={formData.email || ''}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone Number:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone || ''}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <h4 className="mb-3">Check-in Information</h4>
                            <div className="form-group">
                                <label htmlFor="check_in_date">Check-in Date:</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="check_in_date"
                                    name="check_in_date"
                                    value={formData.check_in_date ? formatDate(formData.check_in_date) : ''}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="check_out_date">Check-out Date:</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="check_out_date"
                                    name="check_out_date"
                                    value={formData.check_out_date ? formatDate(formData.check_out_date) : ''}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <h4 className="mb-3">Room Information</h4>
                            <div className="form-group">
                                <label htmlFor="hotel_name">Hotel Name:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="hotel_name"
                                    name="hotel_name"
                                    value={formData.hotel_name || ''}
                                    disabled
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="room_class">Room Class:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="room_class"
                                    name="room_class"
                                    value={formData.room_class || ''}
                                    disabled
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="room_number">Room Number:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="room_number"
                                    name="room_number"
                                    value={formData.room_number || ''}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <h4 className="mb-3">Price</h4>
                            <div className="form-group">
                                <label htmlFor="total_price">Total Price:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="total_price"
                                    name="total_price"
                                    value={formData.total_price || ''}
                                    disabled
                                />
                            </div>
                        </div>

                        <button onClick = {handleSubmit} type="submit" className="btn btn-primary">
                            Update Booking
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UpdateBookingDetail