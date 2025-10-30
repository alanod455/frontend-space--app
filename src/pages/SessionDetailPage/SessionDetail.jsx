import './styles.css'
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import * as sessionAPI from '../../utilities/session-api';

export default function SessionDetail() {
  const { id } = useParams();
  const [session, setSession] = useState(null);

  useEffect(() => {
    if (!id) return;
    async function fetchSession() {
      try {
        const data = await sessionAPI.show(id);
        setSession(data);
      } catch (err) {
        console.error('Error fetching session:', err);
      }
    }
    fetchSession();
  }, [id]);

  if (!session) return <h3>Loading session...</h3>;

  return (
    <section className="detail-session-container">
      <div className="detail-session-img">
        <img src={session.image || "/CARD.jpeg"} alt={session.title} />
      </div>
      <div className="session-details">
        <h1>{session.title}</h1>
        <h2>Duration: {session.duration} minutes</h2>

        {session.sound ? (
          <div>
            <p>
              Session sound:{' '}
              {session.sound
                .split('/')
                .pop()
                .replace('.mp3', '')
                .replace(/^./, c => c.toUpperCase())}
            </p>
            <audio controls>
              <source src={session.sound} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </div>
        ) : (
          <p>Session sound: No sound selected</p>
        )}

        {session.created_at && (
          <p>
            Created at:{' '}
            {new Date(session.created_at).toLocaleString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
      </div>

      <div className="session-actions">
        <Link to={`/session/edit/${session.id}`} className="btn warn">Edit</Link>
        <Link to={`/session/confirm_delete/${session.id}`} className="btn danger">Delete</Link>
      </div>
    </section>

  );
}