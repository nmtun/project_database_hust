import React, { useContext, useEffect, useState } from 'react';
import "./searchItem.css";
import { Link } from "react-router-dom";
import HotelFinder from '../../../apis/HotelFinder';
import { HotelsContext } from '../../../context/HotelsContext';

const SearchItem = (props) => {
  const { hotels, setHotels } = useContext(HotelsContext);
  const imageAddresses = [
    // ... (existing image URLs)
  ];

  const [filteredHotels, setFilteredHotels] = useState([]);
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [capacity, setCapacity] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await HotelFinder.get("/");
        setHotels(response.data.data.hotels);
        setFilteredHotels(response.data.data.hotels);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [setHotels]);

  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * imageAddresses.length);
    return imageAddresses[randomIndex];
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'location':
        setLocation(value);
        break;
      case 'priceMin':
        setPriceRange(prevRange => ({ ...prevRange, min: value }));
        break;
      case 'priceMax':
        setPriceRange(prevRange => ({ ...prevRange, max: value }));
        break;
      case 'capacity':
        setCapacity(value);
        break;
      default:
        break;
    }
  };

  const filterHotels = () => {
    const filtered = hotels.filter(hotel => {
      const matchesLocation = location === '' || hotel.hotel_city.toLowerCase().includes(location.toLowerCase());
      const matchesPrice = hotel.room_price >= priceRange.min && hotel.room_price <= priceRange.max;
      const matchesCapacity = capacity === 0 || hotel.room_capacity >= capacity;
      return matchesLocation && matchesPrice && matchesCapacity;
    });
    setFilteredHotels(filtered);
  };

  useEffect(() => {
    filterHotels();
  }, [location, priceRange, capacity, hotels]);

  return (
    <>
      {/* Add filter inputs here */}
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={location}
        onChange={handleFilterChange}
      />
      <input
        type="number"
        name="priceMin"
        placeholder="Min Price"
        value={priceRange.min}
        onChange={handleFilterChange}
      />
      <input
        type="number"
        name="priceMax"
        placeholder="Max Price"
        value={priceRange.max}
        onChange={handleFilterChange}
      />
      <input
        type="number"
        name="capacity"
        placeholder="Capacity"
        value={capacity}
        onChange={handleFilterChange}
      />

      {filteredHotels.map(hotel => {
        return (
          <div className="searchItem" key={hotel.id}>
            <img
              src={getRandomImage()}
              alt=""
              className="siImg"
            />
            <div className="siDesc">
              <h1 className="siTitle">{hotel.hotel_name}</h1>
              {/* <span className="siDistance">500m from center</span> */}
              <span className="siTaxiOp">{hotel.hotel_address}</span>
              <span className="siTaxiOp">{hotel.hotel_city}</span>

              <span className="siSubtitle">
                Studio Apartment with Air conditioning
              </span>
              <span className="siFeatures">
                Enough for {hotel.room_capacity} people
              </span>
              <span className="siCancelOp">Free cancellation </span>
              <span className="siCancelOpSubtitle">
                You can cancel later, so lock in this great price today!
              </span>
            </div>
            <div className="siDetails">
              <div className="siRating">
                <span>Excellent</span>
                <button>{hotel.hotel_rating}.0</button>
              </div>
              <div className="siDetailTexts">
                <span className="siPrice">{hotel.room_price}$</span>
                <span className="siPrice">{hotel.room_class}</span>
                <span className="siTaxOp">Includes taxes and fees</span>
                <Link to={`/hotel/${hotel.hotel_id}/${hotel.room_class}`} className="siCheckButton">See availability</Link>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default SearchItem;






import React, { useContext, useEffect } from 'react';
import "./searchItem.css";
import { Link } from "react-router-dom";
import HotelFinder from '../../../apis/HotelFinder';
import { HotelsContext } from '../../../context/HotelsContext';

const SearchItem = (props) => {
  const { hotels, setHotels } = useContext(HotelsContext);
  const imageAddresses = [
    "https://img.freepik.com/free-photo/luxury-classic-modern-bedroom-suite-hotel_105762-1787.jpg",
    "https://cf.bstatic.com/xdata/images/hotel/square600/261707778.webp?k=fa6b6128468ec15e81f7d076b6f2473fa3a80c255582f155cae35f9edbffdd78&o=&s=1",
    "https://www.usatoday.com/gcdn/-mm-/05b227ad5b8ad4e9dcb53af4f31d7fbdb7fa901b/c=0-64-2119-1259/local/-/media/USATODAY/USATODAY/2014/08/13/1407953244000-177513283.jpg",
    "https://cf.bstatic.com/xdata/images/hotel/max1024x768/305174102.jpg?k=7a349694b5f32a5db2c260fb3acacf410788ed2923814a4bdd0f60a96fbcc932&o=&hp=1",
    "https://cf.bstatic.com/xdata/images/hotel/max1024x768/279746036.jpg?k=129fa468dc8d7619ccf1cffd8f7d945ca2a541bdfd85819d88c1c09bc527545d&o=&hp=1",
    "https://cf.bstatic.com/xdata/images/hotel/max1024x768/217432640.jpg?k=0623f85906ae7de2d7d2fe2abbb3e5e256836022bbb87963c4cb4177ab2740a2&o=&hp=1",
    // Add more image URLs if needed
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await HotelFinder.get("/");
        setHotels(response.data.data.hotels);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [setHotels]);

  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * imageAddresses.length);
    return imageAddresses[randomIndex];
  };

  return (
    <>
      {hotels && hotels.map(hotel => {
        return (
          <div className="searchItem" key={hotel.id}>
            <img
              src={getRandomImage()}
              alt=""
              className="siImg"
            />
            <div className="siDesc">
              <h1 className="siTitle">{hotel.hotel_name}</h1>
              {/* <span className="siDistance">500m from center</span> */}
              <span className="siTaxiOp">{hotel.hotel_address}</span>
              <span className="siTaxiOp">{hotel.hotel_city}</span>

              <span className="siSubtitle">
                Studio Apartment with Air conditioning
              </span>
              <span className="siFeatures">
                Enough for {hotel.room_capacity} people
              </span>
              <span className="siCancelOp">Free cancellation </span>
              <span className="siCancelOpSubtitle">
                You can cancel later, so lock in this great price today!
              </span>
            </div>
            <div className="siDetails">
              <div className="siRating">
                <span>Excellent</span>
                <button>{hotel.hotel_rating}.0</button>
              </div>
              <div className="siDetailTexts">
                <span className="siPrice">{hotel.room_price}$</span>
                <span className="siPrice">{hotel.room_class}</span>
                <span className="siTaxOp">Includes taxes and fees</span>
                <Link to={`/hotel/${hotel.hotel_id}/${hotel.room_class}`} className="siCheckButton">See availability</Link>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default SearchItem;






















import React, { useContext, useEffect, useState } from 'react';
import "./searchItem.css";
import { Link } from "react-router-dom";
import HotelFinder from '../../../apis/HotelFinder';
import { HotelsContext } from '../../../context/HotelsContext';

const SearchItem = (props) => {
  const { hotels, setHotels } = useContext(HotelsContext);
  const imageAddresses = [
    "https://img.freepik.com/free-photo/luxury-classic-modern-bedroom-suite-hotel_105762-1787.jpg",
    "https://cf.bstatic.com/xdata/images/hotel/square600/261707778.webp?k=fa6b6128468ec15e81f7d076b6f2473fa3a80c255582f155cae35f9edbffdd78&o=&s=1",
    "https://www.usatoday.com/gcdn/-mm-/05b227ad5b8ad4e9dcb53af4f31d7fbdb7fa901b/c=0-64-2119-1259/local/-/media/USATODAY/USATODAY/2014/08/13/1407953244000-177513283.jpg",
    "https://cf.bstatic.com/xdata/images/hotel/max1024x768/305174102.jpg?k=7a349694b5f32a5db2c260fb3acacf410788ed2923814a4bdd0f60a96fbcc932&o=&hp=1",
    "https://cf.bstatic.com/xdata/images/hotel/max1024x768/279746036.jpg?k=129fa468dc8d7619ccf1cffd8f7d945ca2a541bdfd85819d88c1c09bc527545d&o=&hp=1",
    "https://cf.bstatic.com/xdata/images/hotel/max1024x768/217432640.jpg?k=0623f85906ae7de2d7d2fe2abbb3e5e256836022bbb87963c4cb4177ab2740a2&o=&hp=1",
    // Add more image URLs if needed
  ];

  const [filteredHotels, setFilteredHotels] = useState([]);
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [capacity, setCapacity] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await HotelFinder.get("/");
        setHotels(response.data.data.hotels);
        setFilteredHotels(response.data.data.hotels);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [setHotels]);

  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * imageAddresses.length);
    return imageAddresses[randomIndex];
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'location':
        setLocation(value);
        break;
      case 'priceMin':
        setPriceRange(prevRange => ({ ...prevRange, min: value }));
        break;
      case 'priceMax':
        setPriceRange(prevRange => ({ ...prevRange, max: value }));
        break;
      case 'capacity':
        setCapacity(value);
        break;
      default:
        break;
    }
  };

  const filterHotels = () => {
    const filtered = hotels.filter(hotel => {
      const matchesLocation = location === '' || hotel.hotel_city.toLowerCase().includes(location.toLowerCase());
      const matchesPrice = hotel.room_price >= priceRange.min && hotel.room_price <= priceRange.max;
      const matchesCapacity = capacity === 0 || hotel.room_capacity >= capacity;
      return matchesLocation && matchesPrice && matchesCapacity;
    });
    setFilteredHotels(filtered);
  };

  const handleSearch = () => {
    filterHotels();
  };

  return (
    <>
      {/* Add filter inputs here */}
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={location}
        onChange={handleFilterChange}
      />
      <input
        type="number"
        name="priceMin"
        placeholder="Min Price"
        value={priceRange.min}
        onChange={handleFilterChange}
      />
      <input
        type="number"
        name="priceMax"
        placeholder="Max Price"
        value={priceRange.max}
        onChange={handleFilterChange}
      />
      <input
        type="number"
        name="capacity"
        placeholder="Capacity"
        value={capacity}
        onChange={handleFilterChange}
      />
      <button onClick={handleSearch}>Search</button>

      {filteredHotels.map(hotel => {
        return (
          <div className="searchItem" key={hotel.id}>
            <img
              src={getRandomImage()}
              alt=""
              className="siImg"
            />
            <div className="siDesc">
              <h1 className="siTitle">{hotel.hotel_name}</h1>
              {/* <span className="siDistance">500m from center</span> */}
              <span className="siTaxiOp">{hotel.hotel_address}</span>
              <span className="siTaxiOp">{hotel.hotel_city}</span>

              <span className="siSubtitle">
                Studio Apartment with Air conditioning
              </span>
              <span className="siFeatures">
                Enough for {hotel.room_capacity} people
              </span>
              <span className="siCancelOp">Free cancellation </span>
              <span className="siCancelOpSubtitle">
                You can cancel later, so lock in this great price today!
              </span>
            </div>
            <div className="siDetails">
              <div className="siRating">
                <span>Excellent</span>
                <button>{hotel.hotel_rating}.0</button>
              </div>
              <div className="siDetailTexts">
                <span className="siPrice">{hotel.room_price}$</span>
                <span className="siPrice">{hotel.room_class}</span>
                <span className="siTaxOp">Includes taxes and fees</span>
                <Link to={`/hotel/${hotel.hotel_id}/${hotel.room_class}`} className="siCheckButton">See availability</Link>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default SearchItem;