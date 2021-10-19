import { useFetchAPI } from '../hooks/useFetchAPI'
import { Link } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

function AllShops() {
  const apiEndPoint = `/api/shops`
  const { result, isLoading } = useFetchAPI(apiEndPoint)

  if (!result || isLoading) {
    return (
      <Container>
        <h2>Loading.....</h2>
      </Container>
    )
  } else if (result.errorMsg) {
    return (
      <Container>
        <h2>You are not authenticated</h2>
      </Container>
    )
  }
  return (
    <Container>
      <h1 className='mt-3'>All Shops</h1>
      <Row>
        {result.data &&
          result.data.map((eachShop, index) => (
            <Col xs={12} sm={6} lg={3} key={eachShop._id}>
              <Card className='mb-3'>
                <Card.Img
                  className='all-shops-image'
                  variant='top'
                  src={
                    eachShop.shopimage
                      ? eachShop.shopimage
                      : '/images/genericShopImage.jpg'
                  }
                />
                <Card.Body className='all-shops-name'>
                  <Card.Title>{eachShop.name}</Card.Title>
                  <Card.Text>{eachShop.description}</Card.Text>
                  <Button variant='link' className='all-shops-button'>
                    <Link to={`/shops/shop/${eachShop._id}`}>Go To Shop</Link>
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
    </Container>
  )
}

export default AllShops
