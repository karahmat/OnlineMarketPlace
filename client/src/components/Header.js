
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { logOut } from '../utils/authenticate'
import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap'
import { UserContext } from '../App.js'
import MyProfile from './MyProfile'
import Logo from '../components/Logo'
import { SearchBar } from './SearchBar'

const Header = () => {
  const userData = useContext(UserContext)
  //const history = useHistory();
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    if (userData.userId !== '') {
      setLoggedIn(true)
    }
  }, [userData])

  // console.log("decodedToken", decodedToken);
  const handleLogout = () => {
    window.localStorage.removeItem('cartItems')
    window.localStorage.removeItem('shippingAddress')
    logOut().then((res) => {
      if (res === 'signed out') {
        setLoggedIn(false)
        window.location.assign('/')
      }
    })
  }

  return (
    <header id='header'>
      <Navbar bg='info' expand='sm' collapseOnSelect className='p-0'>
        <Container>          
          <Navbar.Toggle aria-controls='basic-navbar-nav' className='ms-auto' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav>
              <Nav.Link href='https://www.instagram.com/langzeitlerner/'>
                Follow us
              </Nav.Link>
            </Nav>
            <Nav className='ms-auto'>
              {loggedIn && (
                <>
                  <Nav.Link href='/shops' >
                    Shops
                  </Nav.Link>
                  <Nav.Link href='/users' >
                    Users
                  </Nav.Link>
                  
                  <Nav.Link href='/messenger' >
                    <i class="far fa-bell fa-sm ml-2">Notifications</i>
                  </Nav.Link>
                  <Nav>
                  <MyProfile handleLogout={handleLogout} />                  
                  </Nav>
                </>
              )}
              {loggedIn === false && (
                <>
                  <Nav.Link href='/shops' >
                    Shops
                  </Nav.Link>
                  <Nav.Link href='/signup' >
                    <i className='fas fa-user-plus'>SignUp</i>
                  </Nav.Link>
                  <Nav.Link href='/login' >
                    <i className='fas fa-user'>Login</i>
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Navbar bg='info' className="p-0" fill>
        <Container>
                   
          <Col xs={2} sm={2} md={2} lg={1} xl={1}>
            <Link to='/'>              
                <Logo />              
            </Link>
          </Col>
          <Col xs={9} sm={9} md={9} lg={8} xl={8} className="justify-content-center">
            <SearchBar />
          </Col>
          
          <Col xs={1} sm={1} md={1} lg={1} xl={1}>          
            <Nav>
              <Nav.Link href="/cart">
                <i className='fas fa-shopping-cart fa-xl'></i>
              </Nav.Link>
            </Nav>          
          </Col>          
                  
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
