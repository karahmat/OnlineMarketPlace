import './Header.css'
import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { logOut } from '../utils/authenticate'
import { Navbar, Nav, Container, Row, Col, NavLink } from 'react-bootstrap'
import { UserContext } from '../App.js'
import MyProfile from './MyProfile'
import Logo from '../components/Logo'
import { SearchBar } from './SearchBar'

const Header = () => {
  const userData = useContext(UserContext)
  const cartItems = useSelector((state) => state.cart.cartItems)
  //const history = useHistory();
  const [loggedIn, setLoggedIn] = useState(false)
  // const [numberItems, setNumberItems] = useState(0)

  useEffect(() => {
    if (userData.userId !== '') {
      setLoggedIn(true)
    }
  }, [userData])

  // useEffect(() => {
  //   const cartItemsStored = localStorage.getItem('cartItems')
  //   if (cartItemsStored) {
  //     setNumberItems(JSON.parse(cartItemsStored).length)
  //   }
  // }, [cartItems])

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
                Follow us<i className='fab fa-instagram fa-lg ms-1'></i>
              </Nav.Link>
            </Nav>
            <Nav className='ms-auto'>
              {loggedIn && (
                <>

                  <LinkContainer to='/shops'>
                    <Nav.Link>Shops</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/users'>
                    <Nav.Link>Users</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/messenger'>
                    <Nav.Link>
                      <i className='far fa-bell fa-sm ml-2 nav-link'>Notifications</i>
                    </Nav.Link>
                  </LinkContainer>

                  <Nav>
                    <MyProfile handleLogout={handleLogout} />
                  </Nav>
                </>
              )}
              {loggedIn === false && (
                <>

                  <LinkContainer to='/shops'>
                    <Nav.Link>Shops</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/signup'>
                    <Nav.Link>
                      <i className='fas fa-user-plus'>SignUp</i>
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/login'>
                    <Nav.Link>
                      <i className='fas fa-user'>Login</i>
                    </Nav.Link>
                  </LinkContainer>

                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Navbar bg='info' className='p-0'>
        <Container>
          <Col xs={3} sm={2} md={2} lg={2} xl={2}>
            <Link to='/'>
              <Logo />
            </Link>
          </Col>
          <Col
            xs={8}
            sm={9}
            md={9}
            lg={7}
            xl={7}
            className='justify-content-center'
          >
            <SearchBar />
          </Col>

          <Col xs={2} sm={2} md={2} lg={1} xl={1}>
            <Nav>

              <LinkContainer to={loggedIn ? '/cart' : '/login'}>
                <Nav.Link>
                  <i className='fas fa-shopping-cart fa-xl'></i>
                  { cartItems.length > 0 && 
                  <span
                    style={{
                      position: 'relative',
                      backgroundColor: '#ff7f7f',
                      top: '-15px',
                      left: '-10px',
                      borderRadius: '8px',
                      fontSize: '10px',
                      padding: '5px',
                    }}
                  >
                    {cartItems.length}
                  </span>
                  }
                </Nav.Link>
              </LinkContainer>
            </Nav>
          </Col>


        </Container>
      </Navbar>
    </header>
  )
}

export default Header
