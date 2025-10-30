import './styles.css';
import * as sessionAPI from '../../utilities/session-api';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function SpaceView() {
  const [spaces, setSpaces] = useState([]);
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
      } catch (err) {
        console.log(err);
      }
    }

    fetchSpaces();
  }, []);

  return (
    <div className="space-wrapper">
      <div className="session-header">
        <h2 className="session-heading">All Sessions</h2>
      </div>
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