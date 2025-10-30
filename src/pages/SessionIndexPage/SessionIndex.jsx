import './styles.css';
import SessionIndexCard from '../../components/SessionIndexCard/SessionIndexCard';
import * as sessionAPI from "../../utilities/session-api";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function SessionIndex() {
  const [allSession, setAllSession] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function getallSession() {
      try {
        const sessionData = await sessionAPI.index();
        setAllSession(sessionData);
      } catch (err) {
        console.log(err);
      }
    }
    if (allSession.length === 0) getallSession();
  }, []);

  return (
    <section className="session-list">
      <div className="session-header">
        <h2 className="session-heading">All Sessions</h2>
      </div>

      <div className="session-grid">
        {allSession.map((session, index) => (
          <SessionIndexCard key={index} session={session} />
        ))}
      </div>
    </section>
  );
}
