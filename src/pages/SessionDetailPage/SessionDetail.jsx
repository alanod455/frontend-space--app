import "./styles.css";
import { useLocation } from "react-router";

export default function SessionDetail() {
  const location = useLocation();
  const session = location.state?.session;

  if (!session) return <h3>Session details not found.</h3>;

  return (
    <section className="detail-session-container">
      <div className="detail-session-img">
        <img
          src={session.image || "/planet.jpeg"}
          alt={session.title}
        />
      </div>
      <div className="session-details">
        <h1>{session.title}</h1>
        <h2>Duration: {session.duration} minutes</h2>
      </div>
    </section>
  );
}