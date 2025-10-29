import './App.css';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router';

import HomePage from '../HomePage/HomePage';
import AboutPage from '../AboutPage/About';
import SessionIndexPage from '../SessionIndexPage/SessionIndex';
import SessionDetailPage from '../SessionDetailPage/SessionDetail';
import SessionForm from '../../components/form/SessionFormPage/SessionForm';

// import headerLogo from '../../assets/images/SPACE.jpeg'; 

function App() {
  const location = useLocation();


  const routes = ['about', 'session', 'home'];
  const mainCSS = routes.filter(r => location.pathname.includes(r)).join(' ');

  return (
    <>
      <header>
        <div className={`${mainCSS} header-logo-container`}>
          <Link to="/">
            <img src='LOGO.jpeg' alt="Logo" />
          </Link>
        </div>
        <nav>
          <ul>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/session">All Sessions</Link></li>
            <li><Link to="/session/new">Start New Session</Link></li>
          </ul>
        </nav>
      </header>

      <main className={mainCSS}>
        <Routes>          
          <Route path="/*"                          element={<Navigate to="/" />} />
          <Route path="/"                           element={<HomePage />} />
          <Route path="/about"                      element={<AboutPage />} />
          <Route path="/session"                    element={<SessionIndexPage />} />
          <Route path="/session/:id"                element={<SessionDetailPage />} />
          <Route path="/session/new"                element={<SessionForm />}/>
          <Route path="/session/edit/:id"           element={<SessionForm />} />
          <Route path="/session/confirm_delete/:id" element={<SessionForm  />} />
        
        </Routes>
      </main>
    </>
  );
}

export default App;