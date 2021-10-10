import React, {useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated, logOut } from '../utils/authenticate';
import { Navbar, Nav, Container } from 'react-bootstrap'
//import { UserContext } from '../App.js';
import MyProfile from './MyProfile';


const Header = () => {
  //const userData = useContext(UserContext);
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
  
  // return (
  //   <nav>
  //       <div className="nav-wrapper">
  //           <Link to="/" className="brand-logo">Logo</Link>
  //           <ul id="nav-mobile" className="right hide-on-med-and-down">
  //               { token && 
  //               <>
  //                   <li><Link to="/users">Users</Link></li>  
  //                   <li><i onClick={handleLogout} className="material-icons" style={{cursor: 'pointer', marginRight: '10px'}}>logout</i></li>
  //               </>                
  //               }
  //               { !token && 
  //               <>
  //                   <li><Link to="/signup">SignUp</Link></li>
  //                   <li><Link to="/login">Login</Link></li>
  //               </>
  //               }
                          
  //           </ul>
  //       </div>
  // </nav>
  // )

    return (
        <header>
            <Navbar bg='info' expand="lg" collapseOnSelect>
                <Container>
                    <Link to="/" ><Navbar.Brand>Logo</Navbar.Brand></Link>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                          { token &&
                            <>
                              <Nav.Link href="/shops">Shops</Nav.Link>                              
                              <Nav.Link href="/users">Users</Nav.Link>
                              <Nav.Link ><i className='fas fa-shopping-cart'>Cart</i></Nav.Link>
                              <MyProfile />
                              <Nav.Link ><i onClick={handleLogout} className="material-icons" style={{cursor: 'pointer', marginRight: '10px'}}>logout</i></Nav.Link>
                            </>
                          }
                          { !token && 
                            <>
                              <Nav.Link href="/shops">Shops</Nav.Link>
                              <Nav.Link href="/signup"><i className='fas fa-user-plus'>SignUp</i></Nav.Link>
                              <Nav.Link href="/login"><i className='fas fa-user'>Login</i></Nav.Link>
                            </>
                          }
                            
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header;