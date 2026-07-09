import React, { useState, useEffect } from "react";
import "./ComplainPage.css";

function ComplaintPage() {
  const [complaints, setComplaints] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "", 
    email: "", 
    phone: "", 
    title: "", 
    type: "",
    priority: "Medium", 
    incidentDate: "", 
    description: "", 
    expectedResolution: "",
  });

  const [files, setFiles] = useState({
    images: [], 
    videos: [], 
    documents: []
  });

  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
 
  const fetchComplaints = async () => {
    try {
    
      const res = await fetch("http://192.168.29.161:3000/api/auth/complainPage");
      if (!res.ok) throw new Error("Failed to fetch complaints");
      
      const data = await res.json();
      setComplaints(data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFile = (type, e) => {
    setFiles({ ...files, [type]: Array.from(e.target.files) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ type: "", text: "" });

    try {
      /* 
        NOTE ON FILES: 
        Because you have file uploads, you should eventually switch this to a 
        FormData object instead of JSON.stringify(formData) so files actually send to your server.
      */
      // FIX: Replace this placeholder string with your actual API submission URL
      const res = await fetch("http://192.168.29.161:3000/api/auth/complainPage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();

      if (res.ok) {
        // FIX: Corrected typos here
        setSubmitMessage({
          type: "success",
          text: "Complaint submitted successfully!",
        });
      
        fetchComplaints();
      
        // Reset Form
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          title: "",
          type: "",
          priority: "Medium",
          incidentDate: "",
          description: "",
          expectedResolution: "",
        });
        
        // Reset Files
        setFiles({ images: [], videos: [], documents: [] });
      } else {
        setSubmitMessage({
          type: "error",
          text: data.message || "Something went wrong.",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitMessage({
        type: "error",
        text: "Could not connect to the server.",
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
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
            </div>
            <div className="cmp-form-row">
              <label>Email Address <span className="cmp-required">*</span></label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="cmp-form-row">
              <label>Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
          </div>

          {/* Complaint Details */}
          <div className="cmp-form-group">
            <h3>Complaint Details</h3>
            <div className="cmp-form-row">
              <label>Complaint Title <span className="cmp-required">*</span></label>
              <input type="text" name="title" placeholder="Brief title of your complaint" value={formData.title} onChange={handleChange} required />
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
              <input type="date" name="incidentDate" value={formData.incidentDate} onChange={handleChange} />
            </div>
          </div>

          {/* Description */}
          <div className="cmp-form-group">
            <label>Description <span className="cmp-required">*</span></label>
            <textarea
              name="description"
              placeholder="Please provide detailed information about your complaint..."
              value={formData.description}
              onChange={handleChange}
              rows="6"
              required
            />
          </div>

          {/* Expected Resolution */}
          <div className="cmp-form-group">
            <label>Expected Resolution (Optional)</label>
            <textarea
              name="expectedResolution"
              placeholder="What resolution are you expecting?"
              value={formData.expectedResolution}
              onChange={handleChange}
              rows="3"
            />
          </div>

          {/* File Uploads */}
          <div className="cmp-form-group">
            <h3>Supporting Documents (Optional)</h3>
            
            <div className="cmp-file-upload">
              <label>Upload Images</label>
              <input type="file" accept="image/*" multiple onChange={(e) => handleFile("images", e)} />
              {files.images.length > 0 && <p className="cmp-file-name">Selected: {files.images.map(f => f.name).join(", ")}</p>}
            </div>

            <div className="cmp-file-upload">
              <label>Upload Video</label>
              <input type="file" accept="video/*" onChange={(e) => handleFile("videos", e)} />
              {files.videos.length > 0 && <p className="cmp-file-name">Selected: {files.videos[0].name}</p>}
            </div>

            <div className="cmp-file-upload">
              <label>Upload Documents (PDF, DOC, DOCX)</label>
              <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFile("documents", e)} />
              {files.documents.length > 0 && <p className="cmp-file-name">Selected: {files.documents[0].name}</p>}
            </div>
          </div>

          {submitMessage.text && (
            <p className={`cmp-message ${submitMessage.type}`}>{submitMessage.text}</p>
          )}

          <button type="submit" disabled={isSubmitting} className="cmp-submit-btn">
            {isSubmitting ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>

      <div className="cmp-complaints-section">
        <h2>My Complaints ({complaints.length})</h2>
        {complaints.length === 0 ? (
          <p className="cmp-no-complaints">No complaints submitted yet.</p>
        ) : (
          complaints.map((item) => (
            <div className="cmp-complaint-card" key={item.id || item._id}>
              <div className="cmp-card-header">
                <h3>{item.title}</h3>
                {/* FIX: Safe optional chaining applied below to prevent crashing if properties are missing */}
                <span className={`cmp-status ${(item.status || "pending").toLowerCase()}`}>
                  {item.status || "Pending"}
                </span>
              </div>
              <div className="cmp-card-body">
                <p><strong>Name:</strong> {item.fullName}</p>
                <p><strong>Type:</strong> {item.type}</p>
                <p><strong>Priority:</strong> {item.priority}</p>
                {item.incidentDate && <p><strong>Incident Date:</strong> {item.incidentDate}</p>}
                <p><strong>Description:</strong> {item.description}</p>
                
                <div className="cmp-status-details">
                  <p><strong>Viewed:</strong> {item.viewed ? "✅ Yes" : "❌ No"}</p>
                  <p><strong>Accepted:</strong> {item.accepted ? "✅ Yes" : "❌ No"}</p>
                  {item.submittedAt && <p><strong>Submitted:</strong> {item.submittedAt}</p>}
                </div>

                {item.reply && <p><strong>Admin Reply:</strong> {item.reply}</p>}

                {(item.image || item.video || item.document) && (
                  <div className="cmp-attachments">
                    <strong>Attachments:</strong>
                    {item.image && <p>📷 {item.image}</p>}
                    {item.video && <p>🎥 {item.video}</p>}
                    {item.document && <p>📄 {item.document}</p>}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ComplaintPage;