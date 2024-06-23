import React, { useContext, useState } from 'react';
// import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from './searchItem/searchItem';
import './list.css';
import { HotelsContext } from '../../context/HotelsContext';

const List = () => {
  // const location = useLocation();
  
  // Kiểm tra xem location.state có tồn tại không và cung cấp giá trị mặc định
  // const state = location.state || {};
  // const defaultDestination = state.destination || '';
  // const defaultDate = state.date || [{ startDate: new Date(), endDate: new Date(), key: 'selection' }];
  // const defaultOptions = state.capacity

  // const [destination, setDestination] = useState(defaultDestination);
  const {date, setDate} = useContext(HotelsContext);
  const [openDate, setOpenDate] = useState(false);
  // const [options, setOptions] = useState(defaultOptions);

  return (
    <div>
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            {/* <h1 className="lsTitle">Search</h1> */}
            {/* <div className="lsItem">
              <label>Destination</label>
              <input placeholder={destination} type="text" value={destination} onChange={(e) => setDestination(e.target.value)} />
            </div> */}
            <div className="lsItem">
              <label>Check-in Date</label>
              <span onClick={() => setOpenDate(!openDate)}>{`${format(
                date[0].startDate,
                "dd/MM/yyyyy"
              )} to ${format(date[0].endDate, "dd/MM/yyyy")}`}</span>
              {openDate && (
                <DateRange
                  onChange={(item) => setDate([item.selection])}
                  minDate={new Date()}
                  ranges={date}
                />
              )}
            </div>
            <div className="lsItem">
              {/*<label>Options</label>
               <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Min price <small>per night</small>
                  </span>
                  <input type="number" className="lsOptionInput" />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Max price <small>per night</small>
                  </span>
                  <input type="number" className="lsOptionInput" />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Adult</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={options}
                    onChange={(e) => setOptions((prev) => ({ ...prev, adult: e.target.value }))}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Children</span>
                  <input
                    type="number"
                    min={0}
                    className="lsOptionInput"
                    placeholder={options.children}
                    onChange={(e) => setOptions((prev) => ({ ...prev, children: e.target.value }))}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Room</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={options.room}
                    onChange={(e) => setOptions((prev) => ({ ...prev, room: e.target.value }))}
                  />
                </div>
              </div> */}
            </div>
            {/* <button>Search</button> */}
          </div>
          <div className="listResult">
            <SearchItem />
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
