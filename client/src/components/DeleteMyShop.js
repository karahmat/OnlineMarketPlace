import Button from 'react-bootstrap/Button';

function DeleteMyShop({shopId, userId}) {
  
    const handleDelete = async () => {
        const response = await fetch(`/api/shops/shop/${shopId}`, {
            method: 'DELETE',
            headers: { 'content-type': 'application/json' }            
        })
        const data = await response.json();
        
        if (data) {
            //history.push('/');           
            window.location.assign(`/shops/by/${userId}`);
            // redirect user to /posts
        } else if (data.errors) {
            console.log(data.errors);
        }
    }

    return ( 
      
    <Button variant="danger rounded" onClick={handleDelete} className="mb-2">
        Delete This Shop
    </Button> 
          
    );
}

export default DeleteMyShop;