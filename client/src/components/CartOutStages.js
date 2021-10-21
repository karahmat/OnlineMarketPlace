import React from 'react'
import { Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const CartOutStages = ({ stage1, stage2, stage3, stage4 }) => {
  return (
    <Nav className='justify-content-center mb-4'>
      <Nav.Item>
        {stage1 ? (
          <LinkContainer to='/login'>
            <Nav.Link>Sign In</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Sign In</Nav.Link>
        )}
      </Nav.Item>{' '}
      <Nav.Item>
        <Nav.Link>
          <i class='fa-solid fa-right-long'></i>{' '}
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        {stage2 ? (
          <LinkContainer to='/cartout'>
            <Nav.Link>Shipping/Payment</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Shipping/Payment</Nav.Link>
        )}
      </Nav.Item>{' '}
      <Nav.Item>
        <Nav.Link>
          <i class='fa-solid fa-right-long'></i>{' '}
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        {stage3 ? (
          <LinkContainer to='/ordersummary'>
            <Nav.Link>Order Summary</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Order Summary</Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  )
}

export default CartOutStages
