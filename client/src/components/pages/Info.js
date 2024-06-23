import React, { useContext, useState } from 'react'
import { HotelsContext } from '../../context/HotelsContext';
import UserFinder from '../../apis/UserFinder';
import './Info.css';
import { useNavigate } from 'react-router-dom';
// import '../../App.css';


const Info = () => {
    // const{addHotels} = useContext(HotelsContext);
    const {selectedHotels} = useContext(HotelsContext);
    const {selectedUser, setSelectedUser} = useContext(HotelsContext);

    let navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        city: '',
      });
    
      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      };

      
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await UserFinder.post("/", {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            city: formData.city
          })
        //   addHotels(response.data.data.hotel)
          setSelectedUser(response.data.data.users);
          console.log(response);
          
        } catch (err) {
            console.log(err);
        }
        navigate(`/booking-confirm`);
      }
      
    
      return (
        <div className='sign-up'>
            <div className=''>
          <h1 className='header'>{selectedHotels && selectedHotels.hotel_name}'s Register Site{selectedUser && selectedUser.customer_id}</h1>
          <form action='' className='inputs'>
            <div>
              {/* <label htmlFor="firstName">First Name:</label> */}
              <input
                placeholder='First name'
                type="text"
                className='input'
                id="firstName"
                name="firstName"
                value={formData && formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              {/* <label htmlFor="lastName">Last Name:</label> */}

              <input
                placeholder='Last name'
                type="text"
                id="lastName"
                className='input'
                name="lastName"
                value={formData && formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              {/* <label htmlFor="email">Email:</label> */}
              <input
                placeholder='Email'
                type="email"
                className='input'
                id="email"
                name="email"
                value={formData && formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              {/* <label htmlFor="phone">Phone:</label> */}
              <input
                placeholder='Phone'
                type="tel"
                id="phone"
                className='input'
                name="phone"
                value={formData && formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              {/* <label htmlFor="city">City:</label> */}
              <input
                placeholder='City'
                
                type="text"
                className='input'
                id="city"
                name="city"
                value={formData && formData.city}
                onChange={handleChange}
                required
              />
            </div>
            {/* <button type="submit">Submit</button> */}
            <button 
                onClick = {handleSubmit}
                type='submit'
                className="btn btn-warning btn-m text-center but">SUBMIT</button>
          </form>
        </div>
        </div>
        
      );
    };

export default Info
