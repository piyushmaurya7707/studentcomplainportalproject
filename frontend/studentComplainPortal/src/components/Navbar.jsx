import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
      <div className="container">

        {/* Logo */}
        <Link className="navbar-brand fw-bold" to="/">
          🎓 SCP
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">

          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/complaints">
                Complaints
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>
          </ul>

          <div className="d-grid gap-2 d-lg-flex">
            <Link
              to="/signup"
              className="btn btn-outline-light mb-2 mb-lg-0"
            >
              Sign Up
            </Link>

            <Link
              to="/login"
              className="btn btn-light"
            >
              Login
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}