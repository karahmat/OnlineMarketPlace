import { createContext, useState } from 'react';
import { Route, Switch } from 'react-router';
import Homepage from './pages/Homepage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import UsersPage from './pages/UsersPage';

export const UserContext = createContext();

function App() {
  const [userData, setUserData] = useState({
    userId: '',
    username: '',
    email: '',
    usertype: ''
  });

  return (
    <div className="App">
      <UserContext.Provider value={userData}>
        <Header />
        <Switch>
          <Route exact={true} path="/">
            <Homepage />
          </Route>
          <Route path="/signup">
            <SignUpPage setUser={setUserData} />
          </Route>
          <Route path="/login">
            <LoginPage setUser={setUserData} />
          </Route>
          <Route path="/users">
            <UsersPage />
          </Route>
        </Switch>
      </UserContext.Provider>
    </div>
  );
}

export default App;
