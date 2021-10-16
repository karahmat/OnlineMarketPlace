import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
// import { mockData } from '../data/mockData'
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
} from 'react-bootstrap'
import Rating from '../components/Rating'
import { useParams, useHistory } from 'react-router'
import { fetchProductsData } from '../store/productsAllAction'

const ProductPage = () => {
  const params = useParams()

  const history = useHistory()

  console.log(params.id)

  const dispatch = useDispatch()

  const [qty, setQty] = useState(1)

  const product = useSelector((state) => state.products.products)

  const cartItems = useSelector((state) => state.cart.cartItems)

  useEffect(() => {
    console.log('this is the 1st', cartItems)
    dispatch(fetchProductsData(`/api/products/product/${params.id}`))
  }, [dispatch, cartItems, params.id])

  // console.log(product.rating)
  // const product = mockData.find((p) => p.id === Number(params.id))

  const addToCartHandler = () => {
    console.log('this is the 2nd', cartItems)
    history.push(`/cart/${params.id}?qty=${qty}`)
  }

  return (
    // <div>yes</div>
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
            <ListGroup.Item>Description:{product.description}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    <strong>${product.price}</strong>
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
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default ProductPage
