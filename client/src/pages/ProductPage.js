import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../App'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Container,
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
  Modal,
  Alert,
} from 'react-bootstrap'
import Rating from '../components/Rating'
import { useParams, useHistory } from 'react-router'
import { fetchProductsData } from '../store/productsAllAction'
import { addToCartAction, removeFromCartAction } from '../store/cartActions'
import DeleteMyProduct from '../components/DeleteMyProduct'
import StartChat from '../components/StartChat'

const ProductPage = () => {
  const userData = useContext(UserContext)

  const params = useParams()

  const history = useHistory()

  const dispatch = useDispatch()

  const [qty, setQty] = useState(1)

  const [showCart, setShowCart] = useState(false)

  const product = useSelector((state) => state.products.products)

  const cartItems = useSelector((state) => state.cart.cartItems)

  useEffect(() => {
    console.log('this is the 1st', cartItems)
    dispatch(fetchProductsData(`/api/products/${params.id}`))
  }, [dispatch, cartItems, params.id])

  // console.log(product.rating)
  // const product = mockData.find((p) => p.id === Number(params.id))

  const addToCartHandler = () => {
    console.log('this is the 2nd', cartItems)
    dispatch(addToCartAction(params.id, qty))
    setShowCart(true)
  }

  const removerFromCartHandler = (itemId) => {
    dispatch(removeFromCartAction(itemId))
  }

  const checkOutHandler = () => {
    history.push('/cartout')
  }

  return (
    <>
      <Container>
        <Link className='btn btn-light my-3' to='/'>
          Go Back
        </Link>
        <Row>
          <Col md={6}>
            <Image src={product.image} alt={product.title} fluid />
          </Col>
          <Col md={3}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h3>{product.title}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                {/* {product.rating && <p>{product.rating.rate}</p>}{' '} */}
                {product.rating && (
                  <Rating
                    value={product.rating.rate}
                    text={`${product.rating.count} reviews`}
                    color='#f8E825'
                  />
                )}
              </ListGroup.Item>
              <ListGroup.Item as="h3">{product.name}</ListGroup.Item>
              <ListGroup.Item>Description: {product.description}</ListGroup.Item>
              <ListGroup.Item>Other products in <Link to={`/shops/shop/${product.shopId}`}>shop</Link></ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <strong>${Number(product.price).toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.quantity > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Qty</Col>
                      <Col>
                        <Form.Control
                          as='select'
                          value={qty}
                          onChange={(e) => setQty(e.target.value)}
                        >
                          {[...Array(product.quantity).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
                {userData.userId !== product.userId && (
                  <ListGroup.Item>
                    <Button
                      onClick={addToCartHandler}
                      className='btn-block'
                      type='button'
                      disabled={product.quantity === 0}
                    >
                      Add to Cart
                    </Button>
                  </ListGroup.Item>
                )}
                {userData.userId === '' && (
                  <ListGroup.Item>
                    <div>
                      <Link to='/login'>Log in</Link> to purchase item
                    </div>
                  </ListGroup.Item>
                )}
                {userData.userId === product.userId && (
                  <>
                    <ListGroup.Item>
                      <Button
                        variant='info rounded'
                        href={`/products/product/${params.id}/${product.shopId}/${product.userId}`}
                        type='button'
                      >
                        Edit Product
                      </Button>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <DeleteMyProduct
                        userId={product.userId}
                        shopId={product.shopId}
                        productId={params.id}
                      />
                    </ListGroup.Item>
                  </>
                )}
                {userData.userId && userData.userId !== product.userId && (
                  <ListGroup.Item>
                    <StartChat
                      userId={userData.userId}
                      sellerId={product.userId}
                      productId={product._id}
                      productName={product.name}
                    />
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal
        show={showCart}
        onHide={() => setShowCart(false)}
        aria-labelledby='cart-modal'
        size='lg'
      >
        <Modal.Header closeButton>
          <Modal.Title id='cart-modal'>Shopping Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container className='my-2'>
            <Row>
              <Col md={8}>
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
                            <Image
                              src={item.image}
                              alt={item.name}
                              fluid
                              rounded
                            />
                          </Col>
                          <Col md={3}>
                            <Link to={`/product/${item.productId}`}>
                              {item.name}
                            </Link>
                          </Col>
                          <Col md={2}>${item.price}</Col>
                          <Col md={3}>
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
                              onClick={() =>
                                removerFromCartHandler(item.productId)
                              }
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
                        {cartItems.reduce((acc, item) => acc + item.qty, 0)})
                        items
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
          </Container>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ProductPage
