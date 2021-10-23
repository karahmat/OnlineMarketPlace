import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import { Link } from 'react-router-dom'
import { useFetchAPI } from '../hooks/useFetchAPI'

function Category() {
  const { result, isLoading } = useFetchAPI('/api/products/categories')

  const pics = [
    '7f0cf11ac33fbdf00ddac030efff44ce_tn',
    'caac3ce14e76b331198c3cef8d85b779_tn',
    '87f207a436d17540e4f6764eaae1d2db_tn',
    'f37b2a75c3f53941b768d56033b1339a_tn',
    '1064fa964219f4782d6e48f0dbff4c9f_tn',
    '85fa6fd2c3c96b2c73ca222dfd134db3_tn',
    '3e08fcc4c1e50937b88bf851b16e8ee9_tn',
    'ce3060228f5dc090d859575e2ef5c800_tn',
    'a7a7242a87b1febc2f70df97fecde728_tn',
    '567b6dc3d7ebd8d1a3fd18b84ea47d9a_tn',
  ]

  if (!result || isLoading) {
    return (
      <Container>
        <h2>Loading.....</h2>
      </Container>
    )
  }

  return (
    <Container className='mb-3 mt-0'>
      <h2 className='mb-0'>Categories</h2>
      <Row className='justify-content-left'>
        {result.length > 0 &&
          result.map((category, index) => (
            <Col
              key={index}
              xs={3}
              sm={2}
              md={2}
              lg={1}
              xl={1}
              className='p-2 mx-xl-3 mx-lg-4 mx-md-2 mx-sm-2 mx-xs-2'
            >
              <Link
                to={`/products/search/category/${category}`}
                className='text-decoration-none link-orange'
              >
                <Card
                  style={{ width: '7rem' }}
                  className='justify-content-center category-card border-0'
                >
                  <Card.Img
                    variant='top'
                    src={`https://cf.shopee.sg/file/${pics[index]}`}
                  />
                  <Card.Body>
                    <Card.Title
                      as='p'
                      className='justify-content-center'
                      style={{ fontSize: '0.8rem' }}
                    >
                      {category}
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
      </Row>
    </Container>
  )
}

export default Category
