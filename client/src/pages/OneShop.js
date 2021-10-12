import { useState, useContext } from 'react';
import { UserContext } from '../App';
import { useParams } from 'react-router-dom';
//custom hook
import { useFetchAPI } from '../hooks/useFetchAPI';
//bootstrap
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
//components or pages
import EditMyShop from '../components/EditMyShop';
import DeleteMyShop from '../components/DeleteMyShop';


function OneShop() {
    const [modalShow, setModalShow] = useState(false);
    const userDataClient = useContext(UserContext);
    const { shopId } = useParams();
    const { result, isLoading } = useFetchAPI(`/api/shops/shop/${ shopId }`);

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
            { result.data && 
            <>
            <h1 className="mt-2">{ result.data.name } </h1>
            <p>Description: { result.data.description }</p>
            <p>Address: { result.data.address} </p>
            <p>Postalcode: { result.data.postalcode} </p>
            <p>Contact Number: { result.data.contactnumber} </p>
            <p>By: { result.userData.username } </p>
            { userDataClient.userId === result.userData._id && 
            <>
                <Button variant="success rounded" onClick={ () => setModalShow(true) } className="mb-2">Edit Shop</Button><br />     
                <EditMyShop shopdata={result.data} show={modalShow} onHide={ () => setModalShow(false) }/>
                <DeleteMyShop userId={result.userData._id} shopId={result.data._id}/>
            </>
            }
            <h2>List of Products</h2>
            </>
            }
        </Container>
     );
}

export default OneShop;
