import React from 'react';
import { Container } from 'react-bootstrap';
import HomePageImages from '../components/HomePageImages.js';
import HomePageProducts from '../components/HomePageProducts.js';
import Category from '../components/Category';

const HomePage = () => {
    
  return (
    <Container> 
      <h2>Online Market Place</h2>     
      <HomePageImages />
      <Category />
      <HomePageProducts />
    </Container>
  )
}

export default HomePage
