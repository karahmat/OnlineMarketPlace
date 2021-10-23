import React, { useEffect, useState } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
import Product from './Product'
import { Row, Col } from 'react-bootstrap'
// import { fetchProductsData } from '../store/productsAllAction'
// import { productsAllActions } from '../store/productsAllSlicer'
import InfiniteScroll from 'react-infinite-scroll-component'
// import { useProducts } from '../hooks/use-products.js'

const HomePageProducts = () => {
  // const { products } = useProducts()

  // console.log(products)
  // const dispatch = useDispatch()

  const [products, setProducts] = useState([])

  const [page, setPage] = useState(2)

  const [hasMore, setHasMore] = useState(true)

  const limit = 24

  // const products = useSelector((state) => state.products.products)

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `/api/products/bypage?page=${1}&limit=${limit}`
      )

      const items = await response.json()
      const { data } = items
      console.log(data)
      setProducts(data)
    }
    fetchData()
  }, [])

  const fetchMoreData = async () => {
    const response = await fetch(
      `/api/products/bypage?page=${page}&limit=${limit}`
    )
    const items = await response.json()
    const { data } = items
    // console.log(data)

    setProducts([...products, ...data])

    if (data.length === 0 || data.length < limit) {
      setHasMore(false)
    }
    setPage((state) => state + 1)
  }

  // useEffect(() => {
  //   dispatch(fetchProductsData(`/api/products/bypage?page=${1}&limit=${limit}`))

  //   return dispatch(productsAllActions.listProducts([]))
  // }, [dispatch])

  // const fetchMoreData = async () => {
  //   dispatch(
  //     fetchProductsData(`/api/products/bypage?page=${page}&limit=${limit}`)
  //   )

  //   dispatch(productsAllActions.listProducts([]))

  //   setPage((state) => state + 1)
  // }

  console.log(products)

  return (
    <>
      <h2>Latest Products</h2>
      {products.length > 1 && (
        <div>
          <InfiniteScroll
            dataLength={products.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={<h4>End of Page</h4>}
          >
            <Row className='p-0'>
              {products.map((product) => (
                <Col key={product._id} xs={6} sm={6} md={4} lg={3} xl={2}>
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
