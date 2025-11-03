import './App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router';
import { useState, useEffect } from 'react';

import HomePage from '../HomePage/HomePage';
import AboutPage from '../AboutPage/About';
import SessionIndexPage from '../SessionIndexPage/SessionIndex';
import SessionDetailPage from '../SessionDetailPage/SessionDetail';
import SessionForm from '../../components/form/SessionFormPage/SessionForm';
import SpaceView from '../SpaceViewPage/SpaceView';
import SignupPage from '../SignupPage/Signup';
import LoginPage from '../LoginPage/Login';
import Navbar from '../../components/Navbar/Navbar';

function App() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const routes = ['about', 'session', 'home'];
  const mainCSS = routes.filter(r => location.pathname.includes(r)).join(' ');

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser({ access: token, user: JSON.parse(userData) });
    }
    setIsLoading(false);
  }, []);

  if (isLoading) return null; 
  return (
    <>
      <header>
        <Navbar user={user} setUser={setUser} />
      </header>

      <main className={mainCSS}>
        <Routes>
          {user ? (
            <>
              <Route path="/home" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/space" element={<SpaceView />} />
              <Route path="/session" element={<SessionIndexPage />} />
              <Route path="/session/:id" element={<SessionDetailPage />} />
              <Route path="/session/new" element={<SessionForm />} />
              <Route path="/session/edit/:id" element={<SessionForm />} />
              <Route path="/session/confirm_delete/:id" element={<SessionForm />} />
              <Route path="*" element={<Navigate to="/home" />} />
            </>
          ) : (
            <>
              <Route path="/home" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/signup" element={<SignupPage setUser={setUser} />} />
              <Route path="/login" element={<LoginPage setUser={setUser} />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </main>
    </>
  );
}

export default App;