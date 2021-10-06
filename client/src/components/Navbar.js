import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
        <div className="nav-wrapper">
            <Link to="/" className="brand-logo">Logo</Link>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
                <li><Link to="/signup">SignUp</Link></li>
                <li><Link to="/login">Login</Link></li>            
            </ul>
        </div>
  </nav>
  )
}

export default Navbar;