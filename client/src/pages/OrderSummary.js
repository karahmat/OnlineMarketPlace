import React, { useContext, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import CartOutStages from '../components/CartOutStages'
import { createOrder } from '../store/orderActions'
import { cartActions } from '../store/cartSlicer'
import { UserContext } from '../App'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'

const OrderSummary = () => {
  const dispatch = useDispatch()

  const history = useHistory()

  const userData = useContext(UserContext)

  const [sdkReady, setSdkReady] = useState(false)

  console.log(userData)

  const cart = useSelector((state) => state.cart)

  // useEffect(() => {
  //   const addPayPalScript = async () => {
  //     const { data } = await axios.get('/api/config/paypal')
  //     console.log(data)
  //     const script = document.createElement('script')
  //     script.type = 'text/javascript'
  //     script.src = `https://www.paypal.com/sdk/js?client-id=${data}`
  //     script.async = true
  //     script.onload = () => {
  //       setSdkReady(true)
  //     }
  //     document.body.appendChild(script)
  //   }
  // }, [])

  // const orderCreate = useSelector((state) => state.order)

  const placeOrderHandler = () => {
    const addPayPalScript = async () => {
      const { data } = await axios.get('/api/config/paypal')
      console.log(data)
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://www.paypal.com/sdk/js?client-id=${data}`
      script.async = true
      script.onload = () => {
        setSdkReady(true)
      }
      document.body.appendChild(script)
    }

    addPayPalScript()

    dispatch(
      createOrder({
        user: userData.userId,
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
      })
    )

    dispatch(cartActions.clearCartInfo())
    window.localStorage.removeItem('cartItems')
    window.localStorage.removeItem('shippingAddress')
    history.push('/ordersuccess')
  }

  return (
    <>
      <CartOutStages stage1 stage2 stage3 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>
                  Address:{cart.shippingAddress.address},{' '}
                  {cart.shippingAddress.postalCode}
                </strong>
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Ordered Items</h2>
              {cart.cartItems.length === 0 ? (
                <p>Your Cart is Empty</p>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item) => (
                    <ListGroup.Item key={item.productId}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>
                    $
                    {cart.cartItems
                      .reduce((acc, item) => acc + item.qty * item.price, 0)
                      .toFixed(2)}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {/* <Button
                  variant='info'
                  type='button'
                  className='btn-block'
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button> */}
                <PayPalButton
                  amount={cart.cartItems
                    .reduce((acc, item) => acc + item.qty * item.price, 0)
                    .toFixed(2)}
                  onSuccess={placeOrderHandler}
                />
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrderSummary
