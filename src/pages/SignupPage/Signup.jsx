import './styles.css';

import { useState } from "react";
import { useNavigate } from "react-router";
import * as usersAPI from "../../utilities/users-api.js";

export default function SignupPage({ setUser }) {
  const navigate = useNavigate();
  const initialState = { username: "", password: "", confirmPassword: "", email: "" };
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({ username: '', password: '', email: '', confirmPassword: '' });

  const disabledSubmitBtn =
    Object.values(errors).every(val => val === "") &&
    Object.values(formData).every(val => val !== "");

  function handleChange(evt) {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
    checkErrors(evt);
  }

  function checkErrors({ target }) {
    const updateErrors = { ...errors };

    if (target.name === 'username') {
      updateErrors.username = target.value.length < 3 ? 'Username must be at least 3 characters.' : "";
    }
    if (target.name === 'password') {
      updateErrors.password = target.value.length < 3 ? "Password must be at least 3 characters." : "";
    }
    if (target.name === 'confirmPassword') {
      updateErrors.confirmPassword = target.value !== formData.password ? "Passwords must match." : "";
    }
    if (target.name === 'email') {
      updateErrors.email = !target.value.includes("@") ? "Email must include '@'." : "";
    }

    setErrors(updateErrors);
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      const newUser = await usersAPI.signup(formData);
      setUser(newUser);
      setFormData(initialState);
      navigate("/space");
    } catch (err) {
      console.log(err);
      setUser(null);
    }
  }

  return (
    <section className="signup-page-container">
      <h1>Sign Up</h1>

      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label>Username</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} />
          {errors.username && <p className="error-msg">{errors.username}</p>}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="text" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <p className="error-msg">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
          {errors.password && <p className="error-msg">{errors.password}</p>}
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
          {errors.confirmPassword && <p className="error-msg">{errors.confirmPassword}</p>}
        </div>

        <button type="submit" disabled={!disabledSubmitBtn} className="btn submit">Create Account</button>
      </form>
    </section>
  );
}