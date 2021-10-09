import React from 'react'
import Product from './Product'
import { Row, Col } from 'react-bootstrap'
import { useProducts } from '../hooks/use-products.js'

const HomePageProducts = () => {
  const { products } = useProducts()

  console.log(products)

  return (
    <>
      <h1>Latest Products</h1>
      <Row>
        {products.map((product) => (
          <Col key={product.id} sm={6} md={4} lg={3} xl={2}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
    </>
  )
}

export default HomePageProducts
