import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Product from './Product'
import { Row, Col } from 'react-bootstrap'
import { fetchProductsData } from '../store/productsAllAction'
import { productsAllActions } from '../store/productsAllSlicer'
// import { useProducts } from '../hooks/use-products.js'

const HomePageProducts = () => {
  // const { products } = useProducts()

  // console.log(products)
  const dispatch = useDispatch()

  const products = useSelector((state) => state.products.products)

  useEffect(() => {
    dispatch(fetchProductsData('/api/products'))

    return dispatch(productsAllActions.listProducts([]))
  }, [dispatch])

  console.log(products)

  return (
    <>
      <h1>Latest Products</h1>
      {products.length > 1 && (
        <Row>
          {products.map((product) => (
            <Col key={product._id} xs={6} sm={6} md={4} lg={3} xl={2}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </>
  )
}

export default HomePageProducts
