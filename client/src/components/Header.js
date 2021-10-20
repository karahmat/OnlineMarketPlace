import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { logOut } from '../utils/authenticate'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { UserContext } from '../App.js';
import MyProfile from './MyProfile'
import Logo from '../components/Logo'
import { SearchBar } from './SearchBar'

const Header = () => {
  const userData = useContext(UserContext);
  //const history = useHistory(); 
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if(userData.userId !== ''){
      setLoggedIn(true);
    } 
  }, [userData])

  // console.log("decodedToken", decodedToken);
  const handleLogout = () => {
    window.localStorage.removeItem("cartItems");
    logOut().then((res) => {      
      if(res === "signed out") {        
        setLoggedIn(false);
        window.location.assign('/');
      }      
      
    });   
    
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
    <header id='header'>
      <Navbar bg='info' expand='lg' collapseOnSelect className='p-0'>
        <Container>
          <Link xs={2} sm={2} mg={2} lg={2} to='/'>
            <Navbar.Brand>
              <Logo />
            </Navbar.Brand>
          </Link>
          <SearchBar />
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              {loggedIn && (
                <>
                  <Nav.Link href='/shops' style={{ color: 'black' }}>
                    Shops
                  </Nav.Link>
                  <Nav.Link href='/users' style={{ color: 'black' }}>
                    Users
                  </Nav.Link>
                  <Nav.Link href='/cart' style={{ color: 'black' }}>
                    <i className='fas fa-shopping-cart'>Cart</i>
                  </Nav.Link>
                  <Nav.Link href='/messenger' style={{ color: 'black' }}>
                    <i class="fas fa-inbox">Inbox</i>
                  </Nav.Link>
                  <MyProfile />
                  <Nav.Link style={{ color: 'black' }}>
                    <i
                      onClick={handleLogout}
                      className='material-icons'
                      style={{ cursor: 'pointer', marginRight: '10px' }}
                    >
                      logout
                    </i>
                  </Nav.Link>
                </>
              )}
              {loggedIn === false && (
                <>
                  <Nav.Link href='/shops' style={{ color: 'black' }}>
                    Shops
                  </Nav.Link>
                  <Nav.Link href='/signup' style={{ color: 'black' }}>
                    <i className='fas fa-user-plus'>SignUp</i>
                  </Nav.Link>
                  <Nav.Link href='/login' style={{ color: 'black' }}>
                    <i className='fas fa-user'>Login</i>
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
