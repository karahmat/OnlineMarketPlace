import React, { useState, useContext } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import {
  saveShippingAddressAction,
  savePaymentMethodAction,
} from '../store/cartActions'
import { useHistory } from 'react-router'
import CartOutStages from '../components/CartOutStages'
import { UserContext } from '../App'

const CartOutPage = () => {
  const userData = useContext(UserContext)
  const shippingAddress = useSelector((state) => state.cart.shippingAddress)
  const [address, setAddress] = useState(shippingAddress.address)
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
  const dispatch = useDispatch()
  const history = useHistory()
  const [paymentMethod, setPaymentMethod] = useState('PayPal')

  const onSubmitHandler = (e) => {
    if (postalCode.length !== 6 ) {
      return alert(
        'postal code is not 6 digits! Please enter a valid postal code.'
      )
    }
    e.preventDefault()
    dispatch(saveShippingAddressAction({ address, postalCode }))
    dispatch(savePaymentMethodAction(paymentMethod))
    history.push(`/cart/${userData.userId}/cartout/ordersummary`)
  }

  return (
    <>
      <CartOutStages stage1 stage2 />
      <FormContainer>
        <Form onSubmit={onSubmitHandler}>
          <h1>Shipping</h1>
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
              type='number'
              minLength={6}
              maxLength={6}
              placeholder='Enter postal code'
              value={postalCode}
              required
              onChange={(e) => setPostalCode(e.target.value)}
            ></Form.Control>
          </Form.Group>{' '}
          <h1 className='mt-5'>Payment</h1>
          <Form.Group>
            <Form.Label as='legend'>Select Payment Method</Form.Label>
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
