import React, { useContext } from 'react';
import { UserContext } from '../App.js';
import { Container } from 'react-bootstrap'

const HomePage = () => {
    
    const userContext = useContext(UserContext);
    const welcomeMessage = userContext.userId !== '' ? `Welcome ${userContext.username}!` : '';
  return (
    <Container>
      <div className='mt-3'>{ welcomeMessage }</div>
      <h2>Online Market Place</h2>
    </Container>
  );
}

export default HomePage;