import React, { useState } from 'react'
import { Form, Button, Card, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import {
  saveShippingAddressAction,
  savePaymentMethodAction,
} from '../store/cartActions'
import { useHistory } from 'react-router'
import CartOutStages from '../components/CartOutStages'

const CartOutPage = () => {
  const shippingAddress = useSelector((state) => state.cart.shippingAddress)
  const [address, setAddress] = useState(shippingAddress.address)
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
  const dispatch = useDispatch()
  const history = useHistory()
  const [paymentMethod, setPaymentMethod] = useState('PayPal')

  const onSubmitHandler = (e) => {
    e.preventDefault()
    dispatch(saveShippingAddressAction({ address, postalCode }))
    dispatch(savePaymentMethodAction(paymentMethod))
    history.push('/ordersummary')
  }

  return (
    <>
      <CartOutStages stage1 stage2 />
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
          <Form.Group>
            <Form.Label as='legend'>Select Method</Form.Label>
            <Col>
              <Form.Check
                type='radio'
                label='PayPal or Credit Card'
                id='PayPal'
                name='paymentMethod'
                value='PayPal'
                checked
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
            </Col>
          </Form.Group>
          <Button type='submit' variant='info'>
            Continue to Order Summary
          </Button>
        </Form>
      </FormContainer>
    </>
  )
}

export default CartOutPage
