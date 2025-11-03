import './styles.css';
import * as sessionAPI from '../../utilities/session-api';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function SpaceView() {
  const [spaces, setSpaces] = useState([]);
  const [counts, setCounts] = useState({ stars: 0, planets: 0 });
  const navigate = useNavigate();

  const planetImages = [
    '/planet.png',
    '/planet2.png',
    '/planet3.png',
  ];

  useEffect(() => {
    async function fetchSpaces() {
      try {
        const allSessions = await sessionAPI.index();

        let starCount = 0;
        let planetCount = 0;

        const enriched = allSessions.map((session) => {
          const isPlanet = session.duration >= 5;
          const size = isPlanet ? 50 : 30;
          const maxX = 800 - size;
          const maxY = 300 - size;

          const x = Math.floor(Math.random() * maxX);
          const y = Math.floor(Math.random() * maxY);

          const image = isPlanet
            ? planetImages[Math.floor(Math.random() * planetImages.length)]
            : '/star.png';

          if (isPlanet) {
            planetCount++;
          } else {
            starCount++;
          }

          return {
            id: session.id,
            title: session.title,
            type: isPlanet ? 'planet' : 'star',
            image,
            x,
            y,
            size,
          };
        });

        setSpaces(enriched);
        setCounts({ stars: starCount, planets: planetCount });
      } catch (err) {
        console.log(err);
      }
    }

    fetchSpaces();
  }, []);

  return (
    <div className="space-wrapper">
      <div className="space-header">
        <h2 className="session-heading">All Sessions</h2>
      </div>


      <section className="space-info-grid">
        <div className="space-card star-card">
          <h3>Stars✨</h3>
          <p>Quick sparks of focus.<br />Sessions under 5 minutes.</p>
          <p><strong>✨:</strong> {counts.stars}</p>
        </div>

        <div className="space-card planet-card">
          <h3>Planets🪐</h3>
          <p>Deep journeys of calm.<br />Sessions 5 minutes or more.</p>
          <p><strong>🪐:</strong> {counts.planets}</p>
        </div>
      </section>

      <section className="space-container">
        <img src="/space-bg.jpg" className="space-bg" alt="background" />

        {spaces.map((item) => (
          <img
            key={item.id}
            src={item.image}
            alt={item.title}
            className="space-object"
            style={{
              left: `${item.x}px`,
              top: `${item.y}px`,
              width: `${item.size}px`,
              height: `${item.size}px`,
            }}
            title={item.title}
            onClick={() => navigate(`/session/${item.id}`)}
          />
        ))}
      </section>
    </div>
  );
}