import { useState, useContext } from 'react';
import { UserContext } from '../App';
import { useParams } from 'react-router-dom';
//custom hook
import { useMultipleFetchAPI } from '../hooks/useMultipleFetchAPI';
//bootstrap
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
//components or pages
import EditMyShop from '../components/EditMyShop';
import DeleteMyShop from '../components/DeleteMyShop';
import Product from '../components/Product';

function OneShop() {
    const [modalShow, setModalShow] = useState(false);
    const userDataClient = useContext(UserContext);
    const { shopId } = useParams();
    const { result, isLoading } = useMultipleFetchAPI([`/api/shops/${ shopId }`, `/api/products?shopId=${ shopId }`]);

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
            { result[0] && 
            <>
            <h1 className="mt-2">{ result[0].data.name } </h1>
            <p>Description: { result[0].data.description }</p>
            <p>Address: { result[0].data.address} </p>
            <p>Postalcode: { result[0].data.postalcode} </p>
            <p>Contact Number: { result[0].data.contactnumber} </p>
            <p>By: { result[0].userData.username } </p>
            { userDataClient.userId === result[0].userData._id && 
            <>
                <Button variant="success rounded" onClick={ () => setModalShow(true) } className="mb-2">Edit Shop</Button><br />     
                <EditMyShop shopdata={result[0].data} show={modalShow} onHide={ () => setModalShow(false) }/>
                <DeleteMyShop userId={result[0].userData._id} shopId={result[0].data._id}/>
            </>
            }
            <h2>List of Products</h2>
            { userDataClient.userId === result[0].userData._id && 
                <Button variant="info" href={`/products/create/${shopId}/${result[0].userData._id}`}>Add More Products</Button>
            }
            { result[1] && 
                <Row>
                {result[1].data.map((product) => (
                  <Col key={product._id} xs={6} sm={6} md={4} lg={3} xl={2}>
                    <Product product={product} />
                  </Col>
                ))}
              </Row>
            }
            </>
            }
        </Container>
     );
}

export default OneShop;
