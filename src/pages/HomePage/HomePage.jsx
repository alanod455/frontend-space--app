import React from 'react';
import './styles.css';
import LOGO from '../../assets/images/LOGO.jpeg';

export default function HomePage() {
  return (
    <section className="logo-container">
      <div className="home-session-container">
        
        <img src={LOGO} alt="LOGO" className="Session-image" />
        <h1>Space where time turns into a galaxy of focus✨</h1>
      </div>
    </section>
  );
}