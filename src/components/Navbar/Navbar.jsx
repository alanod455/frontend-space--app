import './styles.css';

import { useNavigate, Link } from "react-router";
import * as usersAPI from "../../utilities/users-api";
import logo from "../../assets/images/LOGO.jpeg"; 

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  function handleLogout(e) {
    e.preventDefault();
    usersAPI.logout();
    setUser(null);
    navigate("/");
  }

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        
        <li className="logo">
          <Link to="/home">
            <img src={logo} alt="App Logo" className="logo-img" />
          </Link>
        </li>

    
        <div className="nav-links">
          <li><Link to="/about">About</Link></li>

          {user ? (
            <>
              <li><Link to="/space">My Space</Link></li>
              <li><Link to="/session">All Sessions</Link></li>
              <li><Link to="/session/new">Start New Session</Link></li>
              <li>
                <button onClick={handleLogout} className="btn logout">Log out</button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/signup">Sign Up</Link></li>
              <li><Link to="/login">Login</Link></li>
            </>
          )}
        </div>
      </ul>
    </nav>
  );
}