import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Product from './Product'
import { Row, Col } from 'react-bootstrap'
import { fetchProductsData } from '../store/productsAllAction'
import { productsAllActions } from '../store/productsAllSlicer'
import InfiniteScroll from 'react-infinite-scroll-component'
// import { useProducts } from '../hooks/use-products.js'

const HomePageProducts = () => {
  // const { products } = useProducts()

  // console.log(products)
  const dispatch = useDispatch()

  const [page, setPage] = useState(2)

  const limit = 36

  const products = useSelector((state) => state.products.products)

  useEffect(() => {
    dispatch(fetchProductsData(`/api/products/bypage?page=${1}&limit=${limit}`))

    return dispatch(productsAllActions.listProducts([]))
  }, [dispatch])

  const fetchMoreData = async () => {
    dispatch(
      fetchProductsData(`/api/products/bypage?page=${page}&limit=${limit}`)
    )

    dispatch(productsAllActions.listProducts([]))

    setPage((state) => state + 1)
  }

  console.log(products)

  return (
    <>
      <h1>Latest Products</h1>
      {products.length > 1 && (
        <div
          id='scrollableDiv'
          // style={{
          //   height: 300,
          //   overflow: 'auto',
          // }}
        >
          <InfiniteScroll
            dataLength={limit}
            next={fetchMoreData}
            hasMore={true}
            loader={<h4>Loading...</h4>}
            // scrollableTarget='header'
          >
            <Row>
              {products.map((product) => (
                <Col key={product._id} sm={6} md={4} lg={3} xl={2}>
                  <Product product={product} />
                </Col>
              ))}
            </Row>
          </InfiniteScroll>
        </div>
      )}
    </>
  )
}

export default HomePageProducts
