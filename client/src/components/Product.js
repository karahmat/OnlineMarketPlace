import React from 'react'
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap'
import Rating from './Rating'
import { Link } from 'react-router-dom'

const Product = ({ product }) => {
  return (
    <div>
      <Card key={product._id} className='my-3 p-3 rounded product-card'>
        <Link to={`/products/${product._id}`}>
          <Card.Img src={product.image} variant='top' className='card-image' />
        </Link>

        <Card.Body className="pb-0">
          <Link to={`/products/${product._id}`} className="link-dark text-decoration-none">
            <Card.Title as='div'>
              <OverlayTrigger
                placement='right'
                overlay={<Tooltip>{product.name}</Tooltip>}
              >
                <strong className='home-page-product-name'>
                  {product.name.length > 25
                    ? product.name.substring(0, 26) + '...'
                    : product.name.substring(0, 25)}
                </strong>
              </OverlayTrigger>
            </Card.Title>
          </Link>

          <Card.Text as='div'>
            <Rating
              value={product.rating.rate}
              text={`${product.rating.count} reviews`}
              color='#f8E825'
            />
          </Card.Text>

          <Card.Text as='h3'>${product.price.toFixed(2)}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Product
