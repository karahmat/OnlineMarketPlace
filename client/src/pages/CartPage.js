import { useDispatch, useSelector } from 'react-redux'
import { useContext } from 'react'
import { UserContext } from '../App'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router'
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Alert,
  Card,
  Container,
} from 'react-bootstrap'
import { addToCartAction, removeFromCartAction } from '../store/cartActions'

const CartPage = () => {
  const history = useHistory()

  const dispatch = useDispatch()

  const cartItems = useSelector((state) => state.cart.cartItems)

  const userData = useContext(UserContext)

  // const [qtyForm, setQtyForm] = useState(qty)

  const removerFromCartHandler = (itemId) => {
    dispatch(removeFromCartAction(itemId))
  }

  const checkOutHandler = () => {
    history.push('/cartout')
  }

  return (
    <Container className='my-5'>
      {!userData.userId ? (
        <Alert>
          You are not Logged in! To add to cart:
          <Link to='/login'>Login Page</Link>
        </Alert>
      ) : (
        <Row>
          <Col md={8}>
            <h1>Shopping Cart</h1>
            {cartItems.length === 0 ? (
              <Alert>
                Your Cart is Empty<Link to='/'>Go Back</Link>
              </Alert>
            ) : (
              <ListGroup variant='flush'>
                {cartItems.map((item) => (
                  <ListGroup.Item key={item.productId}>
                    <Row>
                      <Col md={2}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col md={3}>
                        <Link to={`/product/${item.productId}`}>
                          {item.name}
                        </Link>
                      </Col>
                      <Col md={2}>${item.price}</Col>
                      <Col md={2}>
                        <Form.Control
                          as='select'
                          size='sm'
                          value={item.qty}
                          onChange={(e) =>
                            dispatch(
                              addToCartAction(
                                item.productId,
                                Number(e.target.value)
                              )
                            )
                          }
                        >
                          {[...Array(item.stock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                      <Col md={2}>
                        <Button
                          type='button'
                          variant='light'
                          onClick={() => removerFromCartHandler(item.productId)}
                        >
                          <i className='fas fa-trash'></i>
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Col>
          <Col md={4}>
            <Card>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>
                    Subtotal (
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
                  </h3>
                  $
                  {cartItems
                    .reduce((acc, item) => acc + item.qty * item.price, 0)
                    .toFixed(2)}
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button
                    type='button'
                    variant='info'
                    disabled={cartItems.length === 0}
                    onClick={checkOutHandler}
                  >
                    {' '}
                    Check Out{' '}
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  )
}

export default CartPage
