import React from 'react';
import { Container } from 'react-bootstrap';
import HomePageImages from '../components/HomePageImages.js';
import HomePageProducts from '../components/HomePageProducts.js';

const HomePage = () => {
    
  return (
    <Container>      
      <HomePageImages />
      <h2>Online Market Place</h2>
      <HomePageProducts />
    </Container>
  )
}

export default HomePage
