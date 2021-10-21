import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import { saveShippingAddressAction } from '../store/cartActions'
import { useHistory } from 'react-router'

const CartOutPage = () => {
  const shippingAddress = useSelector((state) => state.cart.shippingAddress)
  const [address, setAddress] = useState(shippingAddress.address)
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
  const dispatch = useDispatch()
  const history = useHistory()

  const onSubmitHandler = (e) => {
    e.preventDefault()
    dispatch(saveShippingAddressAction({ address, postalCode }))
    history.push('/payment')
  }

  return (
    <FormContainer>
      <h1>Shipping</h1>
      <Form onSubmit={onSubmitHandler}>
        <Form.Group controlId='address'>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter address'
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>{' '}
        <Form.Group controlId='postalCode'>
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter postal code'
            value={postalCode}
            required
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>{' '}
        <Button type='submit' variant='info'>
          Continue to Payment
        </Button>
      </Form>
    </FormContainer>
  )
}

export default CartOutPage
