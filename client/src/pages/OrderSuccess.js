import React from 'react'
import { Image, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export const OrderSuccess = () => {
  return (
    <>
      <Container className='success-content my-3'>
        <h1>Thank you for your purchase!</h1>
      </Container>

      <Container className='success-content my-5'>
        <Link to='/'>
          <h3>Back to Home Page for more shopping!</h3>
        </Link>
      </Container>
      <Container className='success-content my-3'>
        <Image
          src='/images/success.jpg'
          roundedCircle
          fluid
          style={{ maxHeight: '500px' }}
        ></Image>
      </Container>
    </>
  )
}
