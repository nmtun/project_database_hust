import React from 'react';
import '../../App.css';
import HeroSection from '../HeroSection';
import Cards from '../Cards';
import Footer from '../Footer';
import SearchBox from '../searchBox/SearchBox';


function Home() {
  return (
    <>
      <HeroSection />
      <SearchBox />
      <Cards />
      <Footer />
    </>
  );
}

export default Home;