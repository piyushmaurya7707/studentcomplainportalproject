import React from "react";
import { Link } from "react-router-dom";

export default function signup() {
  return (
    <div
      className="container d-flex justify-content-center align-items-center py-5"
      style={{ minHeight: "100vh" }}
    >
      <div className="card shadow p-4" style={{ maxWidth: "500px", width: "100%" }}>
        <div className="text-center mb-4">
          <h2>Student Registration</h2>
          <p className="text-muted">
            Create an account to raise complaints.
          </p>
        </div>

        <form>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your full name"
              required
            />
          </div>

          

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mobile Number</label>
            <input
              type="tel"
              className="form-control"
              placeholder="Enter mobile number"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Set your Student Complaint Portal Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Create password"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm password"
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            Sign Up
          </button>
        </form>

        <div className="text-center mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-decoration-none">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}