import {useFetchAPI} from '../hooks/useFetchAPI';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Product from '../components/Product';

function SearchResultPage() {

    const { searchCat, searchValue } = useParams();
    
    console.log("search Value=",searchValue);    
    const apiEndPt = searchCat === "category" ? `/api/products?category=${searchValue}` : `/api/products/product/${searchCat}/${searchValue}`;
    const { result, isLoading } = useFetchAPI(apiEndPt);
    
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
            <h2 className="mt-3">Search Results for {searchValue}</h2>
            <Row>
            {result.data && result.data.map((product) => (
                <Col key={product._id} sm={6} md={4} lg={3} xl={2}>
                    <Product product={product} />
                </Col>
            ))}
             </Row> 
            
        </Container> 
     );
}

export default SearchResultPage;