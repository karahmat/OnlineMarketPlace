import Button from 'react-bootstrap/Button';
import { logOut } from '../utils/authenticate';

function DeleteMyProfile({userId}) {
  
    const handleDelete = async () => {
        const response = await fetch(`/api/user/${userId}`, {
            method: 'DELETE',
            headers: { 'content-type': 'application/json' }            
        })
        const data = await response.json();
        console.log("RESPONSE", data);

        if (data.data) {
            //history.push('/');
            logOut();
            window.location.assign('/');
            // redirect user to /posts
        } else if (data.errors) {
            console.log(data.errors);
        }
    }

    return ( 
      
    <Button variant="danger rounded" onClick={handleDelete}>
        Delete My Profile
    </Button> 
          
    );
}

export default DeleteMyProfile;