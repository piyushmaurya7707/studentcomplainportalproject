import React from "react";
import confused from "../assets/confused.jpg";
import map from "../assets/map.jpg";
import notgettingcorrectguidence from "../assets/notgettingcorrectguidence.jpg";
import studentdisturbed from "../assets/studentdisturbing.jpg";
import studentsafty from "../assets/studentsafty.jpg";
import teacherfocuseontoppers from "../assets/teacherfocuseontoppers.jpg";
import classroom from "../assets/classroom.jpg";

export default function About() {
  return (
    <div className="container py-5">

      {/* Hero Section */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">
          About Student Complaint Portal
        </h1>

        <p className="lead text-muted">
          Empowering students with safety, focus, and support
          throughout their academic journey.
        </p>
      </div>

      {/* Challenges Section */}
      <div className="row g-4 mb-5">

        <div className="col-md-4">
          <div className="card h-100 shadow">
            <img
              src={teacherfocuseontoppers}
              alt="Teacher Focus"
              className="card-img-top"
              style={{ height: "250px", objectFit: "cover" }}
            />

            <div className="card-body">
              <h5 className="card-title">
                Lack of Equal Academic Attention
              </h5>

              <p className="card-text">
                Some students feel they do not receive adequate
                guidance and support when attention is focused
                mainly on top-performing students.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 shadow">
            <img
              src={classroom}
              alt="Noise"
              className="card-img-top"
              style={{ height: "250px", objectFit: "cover" }}
            />

            <div className="card-body">
              <h5 className="card-title">
                Noise and Distractions
              </h5>

              <p className="card-text">
                Classroom disturbances and noise can affect
                concentration, making it difficult for students
                to focus on their studies.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 shadow">
            <img
              src={studentdisturbed}
              alt="Mental Health"
              className="card-img-top"
              style={{ height: "250px", objectFit: "cover" }}
            />

            <div className="card-body">
              <h5 className="card-title">
                Mental Health Support
              </h5>

              <p className="card-text">
                Academic pressure and personal struggles can
                impact emotional well-being. Students should
                have access to support and guidance.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Guidance Section */}
      <div className="row align-items-center mb-5">

        <div className="col-md-6">
          <img
            src={notgettingcorrectguidence}
            alt="Guidance"
            className="img-fluid rounded shadow"
          />
        </div>

        <div className="col-md-6 mt-4 mt-md-0">
          <h2>Students Need Guidance</h2>

          <p className="text-muted">
            Many students hesitate to share their problems due
            to fear or uncertainty. Our portal provides a secure
            environment where they can express their concerns
            and seek help.
          </p>

          <p className="text-muted">
            Every student's voice matters, and every concern
            deserves attention.
          </p>
        </div>

      </div>

      {/* Features */}
      <div className="bg-light rounded p-5 mb-5">

        <h2 className="text-center mb-4">
          How We Help Students
        </h2>

        <div className="row text-center">

          <div className="col-md-4 mb-4">
            <img
              src={studentsafty}
              alt="Safety"
              className="img-fluid rounded mb-3"
              style={{ height: "200px", objectFit: "cover" }}
            />

            <h4>Student Safety</h4>

            <p>
              Students can report safety concerns and seek
              assistance during emergency situations.
            </p>
          </div>

          <div className="col-md-4 mb-4">
            <img
              src={map}
              alt="Tracking"
              className="img-fluid rounded mb-3"
              style={{ height: "200px", objectFit: "cover" }}
            />

            <h4>Complaint Tracking</h4>

            <p>
              Track the progress of complaints and stay informed
              about updates related to submitted concerns.
            </p>
          </div>

          <div className="col-md-4 mb-4">
            <img
              src={confused}
              alt="Support"
              className="img-fluid rounded mb-3"
              style={{ height: "200px", objectFit: "cover" }}
            />

            <h4>Student Support</h4>

            <p>
              We aim to support students facing academic,
              emotional, or campus-related challenges.
            </p>
          </div>

        </div>

      </div>

      {/* Mission */}
      <div className="text-center">

        <h2 className="mb-4">
          Our Mission
        </h2>

        <p className="lead">
          To create a safer, more inclusive educational
          environment where every student feels heard,
          respected, and supported.
        </p>

        <div className="alert alert-primary mt-4">
          <strong>
            "Every student deserves safety, support,
            and an equal opportunity to succeed."
          </strong>
        </div>

      </div>

    </div>
  );
}