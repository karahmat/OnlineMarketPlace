import React, { useContext } from 'react'
import { UserContext } from '../App.js'
import { Container } from 'react-bootstrap'
import HomePageImages from '../components/HomePageImages.js'
import HomePageProducts from '../components/HomePageProducts.js'

const HomePage = () => {
  const userContext = useContext(UserContext)
  const welcomeMessage =
    userContext.userId !== '' ? `Welcome ${userContext.username}!` : ''
  return (
    <Container>
      <div className='mt-3'>{welcomeMessage}</div>
      <HomePageImages />
      <h2>Online Market Place</h2>
      <HomePageProducts />
    </Container>
  )
}

export default HomePage
