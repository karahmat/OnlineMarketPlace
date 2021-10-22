import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Image, Container } from 'react-bootstrap'

export const OrderSuccess = () => {
  return (
    <>
      <Container className='success-content my-3'>
        <h1>Thank you for your purchase!</h1>
      </Container>

      <Container className='success-content my-5'>
        <LinkContainer to='/'>
          <a>Back to Home Page for more shopping!</a>
        </LinkContainer>
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
