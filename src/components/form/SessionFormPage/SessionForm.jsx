import './styles.css';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router';
import * as sessionAPI from '../../../utilities/session-api';

export default function SessionForm() {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(15);
  const [sound, setSound] = useState('');
  const [image, setImage] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState('');
  const [showCongrats, setShowCongrats] = useState(false);
  const [currSession, setCurrSession] = useState(null);

  const timerRef = useRef(null);
  const audioRef = useRef(null);
  const hasSavedRef = useRef(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const pathname = location.pathname;

  const editSession = pathname.includes('/edit');
  const deleteSession = pathname.includes('/confirm_delete');
  const createSession = pathname.includes('/new');

  const sounds = [
    { label: 'Rain', value: '/sounds/rain.mp3' },
    { label: 'Waves', value: '/sounds/waves.mp3' },
    { label: 'Focus Bell', value: '/sounds/bell.mp3' },
  ];

  useEffect(() => {
    if (pathname.includes('/new')) {
      setTitle('');
      setDuration(15);
      setImage(null);
      setSound('');
      setIsRunning(false);
      setIsMuted(false);
      setTimeLeft(0);
      setError('');
      setShowCongrats(false);
      setCurrSession(null);
    }
  }, [pathname]);

  useEffect(() => {
    if ((editSession || deleteSession) && id) {
      async function fetchSession() {
        try {
          const data = await sessionAPI.show(id);
          setCurrSession(data);
          setTitle(data.title);
          setDuration(data.duration);
          setImage(data.image);
        } catch (err) {
          console.error('Error fetching session:', err);
        }
      }
      fetchSession();
    }
  }, [editSession, deleteSession, id]);

  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleUpdateSession() {
    const updatedData = { title, sound };

    if (image instanceof File) {
      const base64Image = await convertToBase64(image);
      updatedData.image = base64Image;
    }

    try {
      const updatedSession = await sessionAPI.update(id, updatedData);
      navigate(`/session/${updatedSession.id}`, { state: { session: updatedSession } });
    } catch (err) {
      console.error('Error updating session:', err);
    }
  }

  async function handleDelete(evt) {
    evt.preventDefault();
    const response = await sessionAPI.deleteSession(currSession.id);
    if (response.success) {
      navigate("/sessions");
    }
  }

  async function saveSession() {
    let base64Image;

    if (image) {
      base64Image = await convertToBase64(image);
    } else {
      const response = await fetch('/CARD.png');
      const blob = await response.blob();
      base64Image = await convertToBase64(blob);
    }

    const sessionData = {
      title,
      duration,
      image: base64Image,
      sound,
    };

    try {
      const newSession = await sessionAPI.create(sessionData);
      setShowCongrats(true);

      setTimeout(() => {
        setShowCongrats(false);
        navigate(`/session/${newSession.id}`, { state: { session: newSession } });
      }, 5000); 
    } catch (error) {
      console.error("Error saving session:", error);
      setShowCongrats(false);
    }
  }

  function handleStartStop() {
    if (isRunning) {
      const confirmStop = window.confirm("This session will not be saved. Are you sure you want to stop?");
      if (confirmStop) {
        clearInterval(timerRef.current);
        audioRef.current?.pause();
        setIsRunning(false);
        setIsMuted(false);
        navigate('/sessions');
      }
    } else {
      if (!title.trim()) {
        setError('Session title is required.');
        return;
      }

      setError('');
      setTimeLeft(duration * 60);
      setIsRunning(true);
      hasSavedRef.current = false;

      if (sound) {
        audioRef.current = new Audio(sound);
        audioRef.current.loop = true;
        audioRef.current.play();
      }

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            audioRef.current?.pause();

            if (!hasSavedRef.current) {
              hasSavedRef.current = true;
              saveSession(); 
            }

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }

  if ((editSession || deleteSession) && !id) return <h1>Invalid session ID</h1>;
  if (deleteSession && !currSession) return <h1>Loading...</h1>;
  if (deleteSession && currSession) return (
    <section className="delete-card">
      <div className="delete-header">
        <h1>Delete Session?</h1>
        <p>Are you sure you want to delete <strong>{currSession.title}</strong>?</p>
      </div>

      <form onSubmit={handleDelete} className="delete-actions">
        <button type="button" onClick={() => navigate(`/session/${currSession.id}`)} className="btn secondary">
          Cancel
        </button>
        <button type="submit" className="btn danger">
          Yes - Delete!
        </button>
      </form>
    </section>
  );

  if (editSession && !currSession) return <h1>Loading...</h1>;
  if (createSession || editSession) return (
    <>

      <section className="session-form">

        {!isRunning && (
          <>

            <h2>{createSession ? 'Start a New Session' : 'Update Session Details'}</h2>

            <label>
              Title: <span style={{ color: 'red' }}>*</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter session title"
                required
              />
            </label>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {createSession && (
              <label>
                Duration:
                <select value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
                  <option value={1}>1 minute</option>
                  <option value={5}>5 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                </select>
              </label>
            )}

            {createSession && (
              <label>
                Sound:
                <select value={sound} onChange={(e) => setSound(e.target.value)}>
                  <option value="">No Sound</option>
                  {sounds.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </label>
            )}

            <label>
              Image (optional):
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
            {image && (
              <div className="image-preview">
                <img
                  src={image instanceof File ? URL.createObjectURL(image) : image}
                  alt="Session preview"
                  style={{ maxWidth: '200px', borderRadius: '8px' }}
                />
              </div>
            )}

            {editSession && (
              <div className="form-actions">
                <button type="button" onClick={() => navigate(`/session/${id}`)} className="btn secondary">
                  Cancel
                </button>
                <button type="button" onClick={handleUpdateSession} className="btn warn">
                  Update Session
                </button>
              </div>
            )}
          </>
        )}

        {createSession && (
          <button onClick={handleStartStop}>
            {isRunning ? 'Stop Session' : 'Start Session'}
          </button>
        )}

        {isRunning && sound && (
          <button onClick={() => {
            if (audioRef.current) {
              if (isMuted) {
                audioRef.current.play();
              } else {
                audioRef.current.pause();
              }
              setIsMuted(!isMuted);
            }
          }}>
            {isMuted ? 'Unmute Sound' : 'Mute Sound'}
          </button>
        )}

        {isRunning && (
          <div className={`circular-timer ${timeLeft <= 10 ? 'flash' : ''}`}>
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#eee"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#2d2dff"
                strokeWidth="10"
                fill="none"
                strokeDasharray={440}
                strokeDashoffset={440 - (timeLeft / (duration * 60)) * 440}
                transform="rotate(-90 80 80)"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
              <text
                x="80"
                y="90"
                textAnchor="middle"
                fontSize="24"
                fill="#2d2dff"
                fontFamily="monospace"
              >
                {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
                {String(timeLeft % 60).padStart(2, '0')}
              </text>
            </svg>
          </div>
        )}

        {showCongrats && (
          <div className="congrats-message">
            <p>✨ Good job! ✨</p>
            <p>You completed your session </p>
          </div>
        )}
      </section>
    </>
  );
  setShowCongrats

  return null;
}
