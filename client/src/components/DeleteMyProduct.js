import Button from 'react-bootstrap/Button';

function DeleteMyProduct({productId, userId, shopId}) {
  
    const handleDelete = async () => {
       
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE',
            headers: { 'content-type': 'application/json' }, 
            body: JSON.stringify({ userId })            
        })
        const data = await response.json();
        
        if (data.data === "success") {
            //history.push('/');           
            window.location.assign(`/shops/shop/${shopId}`);
            // redirect user to /posts
        } else if (data.errors) {
            console.log(data.errors);
        }
    }

    return ( 
      
    <Button variant="danger rounded" onClick={handleDelete} >
        Delete Product
    </Button> 
          
    );
}

export default DeleteMyProduct;