import React from "react";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <div className="text-center mb-4">
          <h2>Student Complaint Portal</h2>
          <p className="text-muted">Student Login</p>
        </div>

        <form>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Student Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Student Complain Portal Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Remember Me */}
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="remember"
            />
            <label className="form-check-label" htmlFor="remember">
              Remember Me
            </label>
          </div>

          {/* Login Button */}
          <Link to="/Loginpage" className="btn btn-primary w-100">
            Login
          </Link>

          {/* Links */}
          <div className="text-center mt-3">
            <a href="/" className="text-decoration-none">
              Forgot Password?
            </a>
          </div>
        </form>

        <hr />

        <div className="text-center">
          <small className="text-muted">
            Don't have an account? <Link to="/signup" className="text-decoration-none">Sign up </Link>
            If any problem then contact the administrator
          </small>
        </div>
      </div>
    </div>
  );
}

