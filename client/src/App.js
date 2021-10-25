import { createContext, useState, useEffect } from 'react'
import { Route, Switch } from 'react-router'
import Homepage from './pages/Homepage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import Header from './components/Header'
import UsersPage from './pages/UsersPage'
import EditMyProfile from './pages/EditMyProfile'
import CreateShopPage from './pages/CreateShopPage'
import AllShops from './pages/AllShops'
import MyShops from './pages/MyShops'
import OneShop from './pages/OneShop'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import SearchResultPage from './pages/SearchResultPage'
import CreateProductsPage from './pages/CreateProductsPage'
import EditProductPage from './pages/EditProductPage'
import Messenger from './pages/Messenger'
import CartOutPage from './pages/CartOutPage'
import OrderSummary from './pages/OrderSummary'
import { OrderSuccess } from './pages/OrderSuccess'

export const UserContext = createContext()

function App() {
  const [userData, setUserData] = useState({
    userId: '',
    username: '',
    email: '',
    usertype: '',
  })

  const [login, setLogin] = useState(false)

  useEffect(() => {
    //const session = isAuthenticated()
    const getUserData = async () => {
      //console.log("this is called", login);
      const response = await fetch(`/api/users/jwt`, {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
      })
      const data = await response.json()

      if (data.userId) {
        setUserData(data)
        console.log('userData', userData)
      } else if (data.errors) {
        setUserData(data.errors)
      }
    }

    getUserData()
    //if (session) {
    //console.log(session)
    //getUserData(session.id)
    //}

    return function cleanup() {
      setUserData({})
    }
  }, [login])

  return (
    <div className='App'>
      <UserContext.Provider value={userData}>
        <Header login={login} setLogin={setLogin} />
        <Switch>
          <Route exact={true} path='/'>
            <Homepage />
          </Route>
          <Route exact path='/products/:id'>
            <ProductPage />
          </Route>
          <Route path='/cart/:id' exact>
            <CartPage />
          </Route>
          <Route path='/cart/:id/cartout' exact>
            <CartOutPage />
          </Route>
          <Route path='/cart/:id/cartout/ordersummary' exact>
            <OrderSummary />
          </Route>
          <Route path='/cart/:id/cartout/ordersummary/ordersuccess'>
            <OrderSuccess />
          </Route>
          <Route path='/signup'>
            <SignUpPage />
          </Route>
          <Route path='/login'>
            <LoginPage setLogin={setLogin} />
          </Route>
          <Route path='/users'>
            <UsersPage />
          </Route>
          <Route exact={true} path='/user/:userId'>
            <EditMyProfile />
          </Route>
          <Route exact={true} path='/shops'>
            <AllShops />
          </Route>
          <Route path='/shops/createShop'>
            <CreateShopPage />
          </Route>
          <Route path='/shops/by/:userId'>
            <MyShops />
          </Route>
          <Route path='/shops/shop/:shopId'>
            <OneShop />
          </Route>
          <Route exact path='/products/search/:searchCat/:searchValue'>
            <SearchResultPage />
          </Route>
          <Route path='/products/create/:shopId/:userId'>
            <CreateProductsPage />
          </Route>
          <Route path='/products/product/:productId/:shopId/:userId'>
            <EditProductPage />
          </Route>
          <Route path='/messenger'>
            <Messenger />
          </Route>
        </Switch>
      </UserContext.Provider>
    </div>
  )
}

export default App
