import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'

function StartChat({userId, sellerId, productId, productName}) {

    return ( 
    <Button variant="warning rounded">
        <Link style={{textDecoration: 'inherit'}} to={{ 
              pathname: "/messenger", 
              state: {
                userId: {userId},
                sellerId: {sellerId},
                productId: {productId},
                productName: {productName}                    
              }
            }}>Ask Seller</Link>
    </Button> );
}

export default StartChat;