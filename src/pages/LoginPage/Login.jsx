import "./styles.css";
import { useState } from "react";
import { useNavigate } from "react-router";
import * as usersAPI from "../../utilities/users-api";

export default function LoginPage({ setUser }) {
  const navigate = useNavigate();
  const initialState = { username: "", password: "" };
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState("");

  function handleChange(evt) {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  }

  async function handleLogin(evt) {
    evt.preventDefault();
    try {
      const loggedInUser = await usersAPI.login(formData);
      console.log("Login response:", loggedInUser);

      if (loggedInUser) {
        //localStorage.setItem("token", loggedInUser.access);
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        setUser(loggedInUser);
        setFormData(initialState);
        navigate("/space");
      } else if (loggedInUser?.error || loggedInUser?.detail) {
        setUser(null);
        setError(loggedInUser.error || loggedInUser.detail);
      } else {
        setUser(null);
        setError("Unexpected login response.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setUser(null);
      setError("Server error. Please try again later.");
    }
  }

  return (
    <section className="login-page-container">
      <h1>Login</h1>

      <form onSubmit={handleLogin} className="form-container login">
        <div className="form-group">
          <label htmlFor="id_username">Username:</label>
          <input
            value={formData.username}
            type="text"
            name="username"
            maxLength="150"
            required
            id="id_username"
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="id_password">Password:</label>
          <input
            value={formData.password}
            type="password"
            name="password"
            required
            id="id_password"
            onChange={handleChange}
          />
        </div>

        {error && <p className="error-msg">{error}</p>}

        <button type="submit" className="btn submit">Login</button>
      </form>
    </section>
  );
}