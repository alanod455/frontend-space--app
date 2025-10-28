import './styles.css';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
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
  const timerRef = useRef(null);
  const audioRef = useRef(null);
  const hasSavedRef = useRef(false);
  const navigate = useNavigate();

  const sounds = [
    { label: 'Rain', value: '/sounds/rain.mp3' },
    { label: 'Waves', value: '/sounds/waves.mp3' },
    { label: 'Focus Bell', value: '/sounds/bell.mp3' },
  ];

  function handleStartStop() {
    if (isRunning) {
      const confirmStop = window.confirm(
        "This session will not be saved. Are you sure you want to stop?"
      );
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

  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function saveSession() {
    const base64Image = image ? await convertToBase64(image) : null;

    const sessionData = {
      title,
      duration,
      image: base64Image,
    };

    try {
      const newSession = await sessionAPI.create(sessionData);
      setShowCongrats(true);

      setTimeout(() => {
        navigate(`/session/${newSession.id}`, { state: { session: newSession } });
      }, 10000);
    } catch (err) {
      console.log('Error saving session:', err);
    }
  }

  return (
    <section className="session-form">
      {!isRunning && (
        <>
          <h2>Start a New Session</h2>

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

          <label>
            Sound:
            <select value={sound} onChange={(e) => setSound(e.target.value)}>
              <option value="">No Sound</option>
              {sounds.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </label>

          <label>
            Image (optional):
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
        </>
      )}

      <button onClick={handleStartStop}>
        {isRunning ? 'Stop Session' : 'Start Session'}
      </button>

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
        <p>
          Time left: {Math.floor(timeLeft / 60)}:
          {String(timeLeft % 60).padStart(2, '0')}
        </p>
      )}

      {showCongrats && (
        <div className="congrats-message">
          <p>✨ Good Jooob ✨</p>
          <p> You completed your session </p>
        </div>
      )}
    </section>
  );
}