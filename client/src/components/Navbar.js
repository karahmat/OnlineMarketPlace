import React from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated, logOut } from '../utils/authenticate';


const Navbar = () => {
  //const history = useHistory();
  const decodedToken = isAuthenticated();
  // console.log("decodedToken", decodedToken);
  const handleLogout = () => {
    logOut();
    window.location.assign('/');
  }
  return (
    <nav>
        <div className="nav-wrapper">
            <Link to="/" className="brand-logo">Logo</Link>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
                { decodedToken && 
                <>
                    <li><Link to="/users">Users</Link></li>  
                    <li onClick={handleLogout} style={{cursor: 'pointer'}}>Logout</li>
                </>                
                }
                { !decodedToken && 
                <>
                    <li><Link to="/signup">SignUp</Link></li>
                    <li><Link to="/login">Login</Link></li>
                </>
                }
                          
            </ul>
        </div>
  </nav>
  )
}

export default Navbar;