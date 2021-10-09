import { useParams } from 'react-router-dom';
import { useFetchAPI } from '../hooks/useFetchAPI';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function MyShops() {    
    const {userId} = useParams();  
    const apiEndPoint = `/api/shops/by/${userId}`;
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
            <h1 className="mt-3">My Shops</h1>
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

export default MyShops;