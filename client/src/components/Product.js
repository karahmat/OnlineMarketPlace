import React from 'react'
import { Card } from 'react-bootstrap'
import Rating from './Rating'
import { Link } from 'react-router-dom'

const Product = ({ product }) => {
  return (
    <div>
      <Card className='my-3 p-3 rounded'>
        <Link to={`/products/${product._id}`}>
          <Card.Img src={product.image} variant='top' className='card-image' />
        </Link>

        <Card.Body>
          <Link to={`/products/${product._id}`}>
            <Card.Title as='div'>
              <strong>{product.name}...</strong>
            </Card.Title>
          </Link>

          <Card.Text as='div'>
            <Rating
              value={product.rating.rate}
              text={`${product.rating.count} reviews`}
              color='#f8E825'
            />
          </Card.Text>

          <Card.Text as='h3'>${product.price}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Product
