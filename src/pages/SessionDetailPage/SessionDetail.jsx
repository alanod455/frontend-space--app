import './styles.css';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import * as sessionAPI from '../../utilities/session-api';
import * as taskAPI from '../../utilities/task-api';

export default function SessionDetail() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [error, setError] = useState('');
  const [addError, setAddError] = useState('');

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

    async function fetchTasks() {
      try {
        const taskData = await taskAPI.getTasks(id);
        setTasks(taskData);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    }

    fetchSession();
    fetchTasks();
  }, [id]);

  function startEditing(task) {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDuration(task.duration);
    setError('');
  }

  async function handleUpdate(e) {
    e.preventDefault();
    const newDur = parseInt(editDuration);
    const totalUsed = tasks
      .filter((t) => t.id !== editingTaskId)
      .reduce((sum, t) => sum + t.duration, 0);

    if (totalUsed + newDur > session.duration) {
      setError(`Total time exceeds session limit of ${session.duration} minutes.`);
      return;
    }

    try {
      await taskAPI.updateTask(session.id, editingTaskId, {
        title: editTitle,
        duration: newDur,
      });
      const updated = tasks.map((t) =>
        t.id === editingTaskId ? { ...t, title: editTitle, duration: newDur } : t
      );
      setTasks(updated);
      setEditingTaskId(null);
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task.');
    }
  }

  async function handleDelete(taskId) {
    try {
      await taskAPI.deleteTask(session.id, taskId);
      const updatedTasks = tasks.filter((t) => t.id !== taskId);
      setTasks(updatedTasks);
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  }

  async function handleAddTask(e) {
    e.preventDefault();
    setAddError('');

    const newDur = parseInt(newDuration);
    const totalUsed = tasks.reduce((sum, t) => sum + t.duration, 0);

    if (totalUsed + newDur > session.duration) {
      setAddError(`Total time exceeds session limit of ${session.duration} minutes.`);
      return;
    }

    try {
      const newTask = { title: newTitle, duration: newDur };
      const created = await taskAPI.createTask(session.id, newTask);
      setTasks([...tasks, created]);
      setNewTitle('');
      setNewDuration('');
    } catch (err) {
      console.error('Error adding task:', err);
      setAddError('Failed to add task.');
    }
  }

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

      <div className="session-tasks">
        <h3>Tasks in this session:</h3>
        {tasks.length === 0 ? (
          <p>No tasks added yet.</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                {editingTaskId === task.id ? (
                  <form onSubmit={handleUpdate} className="inline-edit-form">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      required
                    />
                    <input
                      type="number"
                      value={editDuration}
                      onChange={(e) => setEditDuration(e.target.value)}
                      required
                      min="1"
                    />
                    <button type="submit" className="icon-btn save" title="Save" />
                    <button type="button" onClick={() => setEditingTaskId(null)} className="icon-btn cancel" title="Cancel" />
                  </form>
                ) : (
                  <>
                    <div className="task-content">
                      <strong>{task.title}</strong> 
                      <span>{task.duration} min</span>
                    </div>
                    <div className="task-actions">
                      <button onClick={() => startEditing(task)} className="icon-btn edit" title="Edit" />
                      <button onClick={() => handleDelete(task.id)} className="icon-btn delete" title="Delete" />
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleAddTask} className="inline-add-form">
          <input
            type="text"
            placeholder="Task title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Duration"
            value={newDuration}
            onChange={(e) => setNewDuration(e.target.value)}
            required
            min="1"
          />
          <button type="submit" className="icon-btn add" title="Add" />
        </form>

        {(error || addError) && <p className="error-msg">{error || addError}</p>}
      </div>

      <div className="session-actions">
        <Link to={`/session/edit/${session.id}`} className="icon-btn edit" title="Edit session" />
        <Link to={`/session/confirm_delete/${session.id}`} className="icon-btn delete" title="Delete session" />
      </div>
    </section>
  );
}