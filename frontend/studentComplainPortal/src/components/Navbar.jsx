import React, { useEffect, useRef, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/complaints", label: "Complaints" },
  { to: "/about", label: "About" },
  { to: "/other-complaint", label: "other complaint" },
];

export default function Navbar() {
  const location = useLocation();
  const linkRefs = useRef([]);
  const navRef = useRef(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const measure = (el) => {
    if (!el || !navRef.current) return null;
    const navBox = navRef.current.getBoundingClientRect();
    const linkBox = el.getBoundingClientRect();
    return {
      left: linkBox.left - navBox.left,
      width: linkBox.width,
      opacity: 1,
    };
  };

  const getActiveIndex = () =>
    NAV_LINKS.findIndex((link) =>
      link.end ? location.pathname === link.to : location.pathname.startsWith(link.to)
    );

  const reposition = () => {
    // Skip on mobile — the drawer uses a plain vertical list, no pill
    if (window.innerWidth < 992) {
      setIndicator((prev) => ({ ...prev, opacity: 0 }));
      return;
    }
    const index = hoveredIndex !== null ? hoveredIndex : getActiveIndex();
    const el = linkRefs.current[index];
    const next = measure(el);
    if (next) setIndicator(next);
    else setIndicator((prev) => ({ ...prev, opacity: 0 }));
  };

  useEffect(() => {
    reposition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, hoveredIndex]);

  useEffect(() => {
    window.addEventListener("resize", reposition);
    return () => window.removeEventListener("resize", reposition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, hoveredIndex]);

  // Close the drawer whenever the route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Lock body scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow sw-navbar">
        <div className="container">

          {/* Logo */}
          <Link className="navbar-brand fw-bold" to="/">
            🎓 SCP
          </Link>

          {/* Mobile Toggle — opens the left drawer */}
          <button
            className="navbar-toggler"
            type="button"
            aria-controls="swDrawer"
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
            onClick={() => setIsOpen(true)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Desktop menu (unchanged, pill indicator) */}
          <div className="collapse navbar-collapse d-none d-lg-flex">

            <ul
              className="navbar-nav me-auto sw-nav-list"
              ref={navRef}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <li
                className="sw-indicator"
                style={{
                  transform: `translateX(${indicator.left}px)`,
                  width: `${indicator.width}px`,
                  opacity: indicator.opacity,
                }}
                aria-hidden="true"
              />

              {NAV_LINKS.map((link, i) => (
                <li className="nav-item" key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.end}
                    ref={(el) => (linkRefs.current[i] = el)}
                    onMouseEnter={() => setHoveredIndex(i)}
                    className={({ isActive }) =>
                      "nav-link sw-nav-link" + (isActive ? " active" : "")
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="d-flex gap-2">
              <Link to="/signup" className="btn btn-outline-light">
                Sign Up
              </Link>
              <Link to="/login" className="btn btn-light">
                Login
              </Link>
              <Link to="/map" className="btn btn-light">
                safty map
              </Link>
            </div>

          </div>
        </div>
      </nav>

      {/* ---------- Mobile off-canvas drawer (slides in from the left) ---------- */}

      <div
        className={"sw-backdrop" + (isOpen ? " show" : "")}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <div
        className={"sw-drawer" + (isOpen ? " show" : "")}
        id="swDrawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="sw-drawer-header">
          <Link className="navbar-brand fw-bold text-white m-0" to="/">
            🎓 SCP
          </Link>
          <button
            className="sw-drawer-close"
            type="button"
            aria-label="Close navigation"
            onClick={() => setIsOpen(false)}
          >
            &times;
          </button>
        </div>

        <ul className="sw-drawer-list">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  "sw-drawer-link" + (isActive ? " active" : "")
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="sw-drawer-actions">
          <Link to="/signup" className="btn btn-outline-light">
            Sign Up
          </Link>
          <Link to="/login" className="btn btn-light">
            Login
          </Link>
          <Link to="/map" className="btn btn-light">
            safty map
          </Link>
        </div>
      </div>
    </>
  );
}