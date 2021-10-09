import { createContext, useState, useEffect } from 'react';
import { Route, Switch } from 'react-router';
import Homepage from './pages/Homepage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import UsersPage from './pages/UsersPage';
import EditMyProfile from './pages/EditMyProfile';
import CreateShopPage from './pages/CreateShopPage';
import AllShops from './pages/AllShops';
import MyShops from './pages/MyShops';
import { isAuthenticated } from './utils/authenticate';

export const UserContext = createContext();

function App() {
  const [userData, setUserData] = useState({
    userId: '',
    username: '',
    email: '',
    usertype: ''
  });  

  useEffect(() => {
    const session = isAuthenticated();      
        
    const getUserData = async (userId) => {
      const response = await fetch(`/api/users/${userId}`, {
          method: 'GET',
          headers: { 'content-type': 'application/json' },          
      })
      const data = await response.json();
      
      if (data.userId) {
          setUserData(data)         
      } else if (data.errors) {
          setUserData(data.errors);
      }
    }  

    if (session) {
      console.log(session);
      getUserData(session.id)
    }

    return function cleanup() { setUserData({})}

  }, [])
    

  return (
    <div className="App">
      <UserContext.Provider value={userData}>
        <Header />
        <Switch>
          <Route exact={true} path="/">
            <Homepage />
          </Route>
          <Route path="/signup">
            <SignUpPage />
          </Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/users">
            <UsersPage />
          </Route>
          <Route exact={true} path="/user/:userId" >
            <EditMyProfile />
          </Route>
          <Route exact={true} path="/shops">
            <AllShops />
          </Route>
          <Route path="/shops/createShop">
            <CreateShopPage />
          </Route>          
          <Route path="/shops/by/:userId">
            <MyShops />
          </Route>
        </Switch>
      </UserContext.Provider>
    </div>
  );
}

export default App;
