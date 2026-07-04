import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
try {
  const response = await api.post("/login", {
    email: formData.email,
    password: formData.password,
  });

  console.log(response.data);

  if (response.data.success) {
    localStorage.setItem("isLoggedIn", "true");
    alert(response.data.message);
    navigate("/complaint");
  }
} catch (err) {
  console.error(err);

  if (err.response) {
    setError(err.response.data.message);
  } else {
    setError("Cannot connect to server");
  }
} finally {
  setLoading(false);
}
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <div className="text-center mb-4">
          <h2>Student Complaint Portal</h2>
          <p className="text-muted">Student Login</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Student Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-3">
          <a href="#" className="text-decoration-none">Forgot Password?</a>
        </div>

        <hr />

        <div className="text-center">
          <small className="text-muted">
            Don't have an account?{" "}
            <Link to="/signup" className="text-decoration-none">Sign up</Link>
          </small>
        </div>
      </div>
    </div>
  );
}