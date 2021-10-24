import { useParams, Link } from 'react-router-dom';
import { useFetchAPI } from '../hooks/useFetchAPI';
// import { UserContext } from '../App';
// import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function MyShops() {    
    // const userData = useContext(UserContext);
    const {userId} = useParams();  
    const apiEndPoint = `/api/shops/users/${userId}`;
    const {result, isLoading} = useFetchAPI(apiEndPoint);   

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
            { result.username && <h1 className="mt-3">{result.username}'s Shops</h1>}
            <Row>
            { result.data && result.data.map((eachShop) => ( 
                <Col xs={12} sm={6} lg={3} key={eachShop._id}>               
                    <Card className="mb-3">
                        <Card.Img 
                            variant="top" 
                            src={
                                eachShop.shopimage
                                  ? eachShop.shopimage
                                  : '/images/genericShopImage.jpg'
                              }
                        />
                        <Card.Body>
                            <Card.Title>{eachShop.name}</Card.Title>
                            <Card.Text>
                                {eachShop.description}
                            </Card.Text>
                            <Button variant="link"><Link to={`/shops/shop/${eachShop._id}`}>Go To Shop</Link></Button>
                        </Card.Body>
                </Card>
              </Col>
            ))}
            </Row>
                 
            
            
        </Container> 
    );
}

export default MyShops;