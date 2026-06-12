import React from "react";
import { Link } from "react-router-dom";
import classroom from "../assets/classroom.jpg";
import student from "../assets/student.jpg";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <div className="container py-5">
        <div className="row align-items-center">

          {/* Text Section */}
          <div className="col-lg-6 text-center text-lg-start">
            <h1 className="display-5 fw-bold mb-3">
              Student Complaint Portal
            </h1>

            <p className="lead text-muted">
              A safe and transparent platform where students can
              submit complaints, track their status, and ensure
              their voices are heard.
            </p>

            <div className="mt-4 d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
              <Link to="/login" className="btn btn-primary btn-lg">
                Login
              </Link>

              <Link to="/signup" className="btn btn-outline-primary btn-lg">
                Register / Sign Up
              </Link>
            </div>
          </div>

          {/* Main Image */}
          <div className="col-lg-6 mt-5 mt-lg-0">
            <img
              src={classroom}
              alt="Classroom"
              className="img-fluid rounded shadow"
            />
          </div>

        </div>
      </div>

      {/* Features Section */}
      <div className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-5">
            Why Use Our Portal?
          </h2>

          <div className="row g-4">

            <div className="col-md-4">
              <div className="card h-100 shadow-sm text-center p-3">
                <h4>Easy Reporting</h4>
                <p>
                  Submit complaints online without visiting
                  administrative offices.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 shadow-sm text-center p-3">
                <h4>Track Status</h4>
                <p>
                  Monitor the progress of your complaints
                  in real time.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 shadow-sm text-center p-3">
                <h4>Secure System</h4>
                <p>
                  Student data and complaints remain
                  confidential and protected.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Support Section */}
      <div className="container py-5">
        <div className="row align-items-center">

          <div className="col-md-4 text-center">
            <img
              src={student}
              alt="Student Support"
              className="img-fluid"
              style={{ maxHeight: "250px" }}
            />
          </div>

          <div className="col-md-8 text-center text-md-start mt-4 mt-md-0">
            <h3>Need Help?</h3>

            <p className="text-muted">
              If you are facing academic, administrative,
              infrastructure, or personal issues within the
              institution, our portal is here to support you.
            </p>

            <Link to="/login" className="btn btn-success">
              Raise a Complaint
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}