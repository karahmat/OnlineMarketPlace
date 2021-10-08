import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated, logOut } from '../utils/authenticate';


const Navbar = () => {
  //const history = useHistory();
  const [token, setToken] = useState(null);
  
  useEffect(() => {
    const decodedToken = isAuthenticated();
    if (decodedToken) {
      setToken(decodedToken);
    }
  }, [])
  
  // console.log("decodedToken", decodedToken);
  const handleLogout = () => {    
    setToken(null);
    logOut();
    //history.push("/");
    window.location.assign('/');
  }
  
  return (
    <nav>
        <div className="nav-wrapper">
            <Link to="/" className="brand-logo">Logo</Link>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
                { token && 
                <>
                    <li><Link to="/users">Users</Link></li>  
                    <li><i onClick={handleLogout} className="material-icons" style={{cursor: 'pointer', marginRight: '10px'}}>logout</i></li>
                </>                
                }
                { !token && 
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