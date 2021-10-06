import React, { useContext } from 'react';
import { UserContext } from '../App.js';

const HomePage = () => {
    const userContext = useContext(UserContext);
    console.log(userContext);
    const welcomeMessage = userContext.userId !== '' ? `Welcome ${userContext.username}!` : '';
  return (
    <div>
      <div>{ welcomeMessage }</div>
      <h2>Online Market Place</h2>
    </div>
  );
}

export default HomePage;