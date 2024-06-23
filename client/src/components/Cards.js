import React from 'react';
import './Cards.css';
import CardItem from './CardItem';

function Cards() {
  return (
    <div className='cards'>
      <h1>Check out these EPIC Destinations!</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            <CardItem
              src='images/img-9.jpg'
              text='Hà Nội - Khám phá 36 phố phường cùng HDV Andrew siêu nhiệt huyết và tận tâm'
              label='Adventure'
              path='/services'
            />
            <CardItem
              src='images/img-2.jpg'
              text='Hồ Chí Minh - khám phá thành phố mang tên Bác cùng chợ Bến Thành với nhiều deal hấp dẫn'
              label='Luxury'
              path='/services'
            />
          </ul>
          <ul className='cards__items'>
            <CardItem
              src='images/img-3.jpg'
              text='Cố đô Huế - Thưởng thức Nhã Nhạc cung đình Huế trong khi trải nghiệm ẩm thực 5 sao trên dòng dông Hương thơ mộng'
              label='Mystery'
              path='/services'
            />
            <CardItem
              src='images/img-4.jpg'
              text='Địa điểm du lịch Nha Trang luôn khiến các tín đồ mê xê dịch “thương nhớ” bởi cảnh sắc phong phú và thơ mộng'
              path='/services'
            />
            <CardItem
              src='images/img-8.jpg'
              text='Một chuyến đi du lịch Hải Phòng đầy lý thú'
              label='Adrenaline'
              path='/services'
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;