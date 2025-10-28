import './styles.css';
import SessionIndexCard from '../../components/SessionIndexCard/SessionIndexCard';
// import spaceImage from '../../assets/images/SPACE.jpeg';
import * as sessionAPI from "../../utilities/session-api";
import { useState, useEffect } from 'react';

export default function SessionIndex() {
  const [allSession, setAllSession] = useState([]);

  useEffect(() => {
    async function getallSession() {
      try {
        const sessionData = await sessionAPI.index();
        console.log(sessionData);
        setAllSession(sessionData);
      } catch (err) {
        console.log(err);
      }
    }
    if (allSession.length === 0) getallSession();
  }, []);

  return (
    <section className="session-list">
      <h2 className="session-heading"></h2>
      {allSession.map((session, index) => (
        <SessionIndexCard key={index} session={session} />
      ))}
    </section>
  );
}
