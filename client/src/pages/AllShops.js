import { useFetchAPI } from '../hooks/useFetchAPI';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function AllShops() {         
    const apiEndPoint = `/api/shops`;
    const {result, isLoading } = useFetchAPI(apiEndPoint);   

    if (!result || isLoading) {
        return ( 
        <Container>
            <h2>Loading.....</h2>
        </Container>)
    } else if (result.errorMsg) {
        return (
        <Container>
            <h2>You are not authenticated</h2>
        </Container>
        )
    }
    return ( 
        
        <Container>              
            <h1 className="mt-3">All Shops</h1>
            <Row>
            { result.data && result.data.map((eachShop, index) => ( 
                <Col xs={12} sm={6} lg={3}>               
                    <Card className="mb-3" key={eachShop._id} >
                        <Card.Img variant="top" src={eachShop.shopimage} />
                        <Card.Body>
                            <Card.Title>{eachShop.name}</Card.Title>
                            <Card.Text>
                                {eachShop.description}
                            </Card.Text>                            
                            <Button variant="primary">Go To Shop</Button>
                        </Card.Body>
                </Card>
              </Col>
            ))}
            </Row>
                 
            
            
        </Container> 
    );
}

export default AllShops;