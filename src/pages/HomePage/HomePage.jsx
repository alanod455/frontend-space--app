import React from 'react';
import './styles.css';
import SPACE from '../../assets/images/SPACE.jpeg';

export default function HomePage() {
  return (
    <section className="logo-container">
      <div className="home-session-container">
        <img src={SPACE} alt="SPACE" className="session-image" />
      </div>
    </section>
  );
}