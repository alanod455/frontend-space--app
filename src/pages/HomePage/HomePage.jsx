import React from 'react';
import './styles.css';
import CARD from '../../assets/images/CARD.png';

export default function HomePage() {
  return (
    <section className="logo-container">
      <div className="home-session-container">
        
        <img src={CARD} alt="CARD" className="session-image" />
        <h1>Space where time turns into a galaxy of focus✨</h1>
      </div>
    </section>
  );
}