import {useFetchAPI} from '../hooks/useFetchAPI.js';
// import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';


function UsersPage() {
    const apiEndPoint = "/api/users";
    const {result, isLoading } = useFetchAPI(apiEndPoint);
        
    if (!result || isLoading) {
        return ( 
        <div className="container">
            <h2>Loading.....</h2>
        </div>)
    } else if (result.errorMsg) {
        return (
        <div className="container">
            <h2>You are not authenticated</h2>
        </div>
        )
    }
    return ( 
        <Container>
            <h1>Users Page</h1>
            <Row>
            { console.log("after render", result.data) }
            { result.data && result.data.map((eachUser) => (
                <Col xs={12} sm={6} lg={3} key={eachUser._id}>
                    <Card className="mb-3" bg="success" border="dark">                        
                        <Card.Body>
                            <Card.Title>{eachUser.username}</Card.Title>                           
                        </Card.Body>
                        <ListGroup className="flush" >
                            <ListGroupItem variant="light text-black">Email: {eachUser.email}</ListGroupItem>
                            <ListGroupItem variant="light text-black">Type: {eachUser.usertype}</ListGroupItem>                            
                        </ListGroup>
                        <Card.Body>
                            { eachUser.usertype === "seller" && <Card.Link href={`/shops/by/${eachUser._id}`}>Go To Shops</Card.Link>}                            
                        </Card.Body>
                    </Card>

                </Col>
            ))}
            </Row>
        </Container> 
    );
}

export default UsersPage;