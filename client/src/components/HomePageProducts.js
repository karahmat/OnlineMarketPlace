import React, { useEffect, useState } from 'react'
import Product from './Product'
import { Row, Col } from 'react-bootstrap'

const HomePageProducts = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const url = 'https://fakestoreapi.com/products'

    const DummyProductsApiCall = () => {
      fetch(url)
        .then((res) => res.json())
        .then((data) => setProducts(data))
    }
    DummyProductsApiCall()
  }, [])

  return (
    <>
      <h1>Latest Products</h1>
      <Row>
        {products.map((product) => (
          <Col key={product.id} sm={12} md={9} lg={6} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
    </>
  )
}

export default HomePageProducts
