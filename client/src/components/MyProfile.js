import {useContext} from 'react';
import {UserContext} from '../App.js';
import {Dropdown} from 'react-bootstrap';
import { Link } from 'react-router-dom';

function MyProfile() {

    const userData = useContext(UserContext);
    console.log(userData.usertype);

    return (
        
    <Dropdown>
        <Dropdown.Toggle id="userdropdown" variant="link-primary">
            <i className="material-icons">account_circle</i>
        </Dropdown.Toggle>

        <Dropdown.Menu>
            <Dropdown.ItemText>{userData.username}</Dropdown.ItemText>
            <Dropdown.ItemText>{userData.email}</Dropdown.ItemText>
            <Dropdown.ItemText>{userData.usertype}</Dropdown.ItemText>
            { userData.usertype === "seller" && <Dropdown.Item as="button"><Link to={`/shops/by/${userData.userId}`}>My Shops</Link></Dropdown.Item> }
            { userData.usertype === "seller" && <Dropdown.Item as="button"><Link to={`/shops/CreateShop`}>Create Shop</Link></Dropdown.Item> }            
            <Dropdown.Item as="button"><Link to={`/user/${userData.userId}`}>Edit Profile</Link></Dropdown.Item>        
        </Dropdown.Menu>
    </Dropdown>  
    );
}

export default MyProfile;