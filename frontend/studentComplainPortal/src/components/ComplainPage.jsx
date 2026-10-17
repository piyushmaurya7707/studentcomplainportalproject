import React, { useState, useEffect } from "react";
import api from "../services/api";
import "./ComplainPage.css";

function ComplaintPage() {
  const [complaints, setComplaints] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    title: "",
    type: "",
    priority: "Medium",
    incidentDate: "",
    description: "",
    expectedResolution: "",
  });

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData((prev) => ({
        ...prev,
        fullName: parsedUser.fullName || "",
        email: parsedUser.email || "",
      }));
    }
  }, []);

  // Fetch complaints
  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get("/complaint");   // This will call /api/auth/complaint
      setComplaints(res.data.complains || res.data || []);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      if (error.response?.status === 401) {
        setSubmitMessage({
          type: "error",
          text: "Session expired. Please login again.",
        });
      } else {
        setSubmitMessage({
          type: "error",
          text: error.response?.data?.message || "Failed to load complaints",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch complaints when user is loaded
  useEffect(() => {
    if (user) {
      fetchComplaints();
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ type: "", text: "" });

    try {
      const res = await api.post("/complaint", formData);   // → /api/auth/complaint

      if (res.data.success) {
        setSubmitMessage({
          type: "success",
          text: "Complaint submitted successfully!",
        });

        // Reset form
        setFormData({
          fullName: user?.fullName || "",
          email: user?.email || "",
          title: "",
          type: "",
          priority: "Medium",
          incidentDate: "",
          description: "",
          expectedResolution: "",
        });

        // Refresh complaints list
        fetchComplaints();
      }
    } catch (error) {
      console.error(error);
      setSubmitMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to submit complaint",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cmp-complaint-container">
      <h1>Complaint Management System</h1>

      <div className="cmp-form-section">
        <h2>Submit New Complaint</h2>
        <form className="cmp-complaint-form" onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div className="cmp-form-group">
            <h3>Personal Information</h3>
            <div className="cmp-form-row">
              <label>Full Name <span className="cmp-required">*</span></label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="cmp-form-row">
              <label>Email Address <span className="cmp-required">*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Complaint Details */}
          <div className="cmp-form-group">
            <h3>Complaint Details</h3>
            <div className="cmp-form-row">
              <label>Complaint Title <span className="cmp-required">*</span></label>
              <input
                type="text"
                name="title"
                placeholder="Brief title of your complaint"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="cmp-form-row">
              <label>Complaint Type <span className="cmp-required">*</span></label>
              <select name="type" value={formData.type} onChange={handleChange} required>
                <option value="">Select Type</option>
                <option value="Technical">Technical Issue</option>
                <option value="Billing">Billing & Payment</option>
                <option value="Service">Service Quality</option>
                <option value="Product">Product Related</option>
                <option value="Staff">Staff Behavior</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="cmp-form-row">
              <label>Priority Level</label>
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div className="cmp-form-row">
              <label>Date of Incident</label>
              <input
                type="date"
                name="incidentDate"
                value={formData.incidentDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="cmp-form-group">
            <label>Description <span className="cmp-required">*</span></label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              required
            />
          </div>

          <div className="cmp-form-group">
            <label>Expected Resolution (Optional)</label>
            <textarea
              name="expectedResolution"
              value={formData.expectedResolution}
              onChange={handleChange}
              rows="3"
            />
          </div>

          {/* File Uploads - Uncomment when backend supports files */}
          {/* 
          <div className="cmp-form-group">
            <label>Upload Images (Optional)</label>
            <input type="file" multiple accept="image/*" />
          </div>
          <div className="cmp-form-group">
            <label>Upload Videos (Optional)</label>
            <input type="file" multiple accept="video/*" />
          </div>
          <div className="cmp-form-group">
            <label>Upload Documents (Optional)</label>
            <input type="file" multiple accept=".pdf,.doc,.docx" />
          </div>
          */}

          {submitMessage.text && (
            <p className={`cmp-message ${submitMessage.type}`}>{submitMessage.text}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="cmp-submit-btn"
          >
            {isSubmitting ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>

      <div className="cmp-complaints-section">
        <h2>My Complaints ({complaints.length})</h2>

        {loading ? (
          <p>Loading complaints...</p>
        ) : complaints.length === 0 ? (
          <p>No complaints found.</p>
        ) : (
          complaints.map((complaint, index) => (
            <div key={complaint._id || index} className="complaint-item">
              <h3>{complaint.title}</h3>
              <p><strong>Type:</strong> {complaint.type}</p>
              <p><strong>Priority:</strong> {complaint.priority}</p>
              <p><strong>Description:</strong> {complaint.description}</p>
              <p><strong>Status:</strong> {complaint.Status || "Pending"}</p>
              <small>
                Submitted: {new Date(complaint.createdAt).toLocaleDateString()}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ComplaintPage;