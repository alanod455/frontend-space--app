import "./styles.css";
import { Link } from 'react-router';

export default function SessionIndexCard({ session }) {
  return (
    <Link
      to={`/session/${session.id}`}
      state={{ session }} 
      className="session-card-link"
    >
      <div className="session-card">
        <img
          src={session.image || '/CARD.png'}
          alt={session.title}
          className="session-image"
        />
        <h3 className="session-title">{session.title}</h3>
        <p className="session-duration">{session.duration} mins</p>
      </div>
    </Link>
  );
}