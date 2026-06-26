import React, { useState, useEffect } from "react";
import "./AdminPage.css";

function AdminPage() {
  const [complaints, setComplaints] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [replyText, setReplyText] = useState("");

  // Default Sample Data
  const defaultComplaints = [
    {
      id: 1001,
      fullName: "Rahul Sharma",
      email: "rahul.sharma@gmail.com",
      phone: "9876543210",
      title: "Internet Connection Issue",
      type: "Technical",
      priority: "High",
      incidentDate: "2025-06-20",
      description: "My internet connection is very slow and keeps disconnecting frequently.",
      expectedResolution: "Requesting faster resolution or compensation.",
      viewed: false,
      accepted: false,
      status: "Pending",
      reply: "Thank you for your complaint. Our team will review it within 48 hours.",
      image: "speedtest.jpg",
      video: null,
      document: null,
      submittedAt: "June 25, 2025, 10:15 AM"
    },
    {
      id: 1002,
      fullName: "Priya Patel",
      email: "priya.patel@gmail.com",
      phone: "9123456789",
      title: "Wrong Amount Charged",
      type: "Billing",
      priority: "Medium",
      incidentDate: "2025-06-22",
      description: "I was charged double for the monthly subscription.",
      expectedResolution: "Refund the extra amount charged.",
      viewed: true,
      accepted: false,
      status: "In Progress",
      reply: "We are verifying your transaction. Refund will be processed soon.",
      image: null,
      video: null,
      document: "bill.pdf",
      submittedAt: "June 25, 2025, 11:30 AM"
    },
    {
      id: 1003,
      fullName: "Rahul Sharma",
      email: "rahul.sharma@gmail.com",
      phone: "9876543210",
      title: "App Crashing on Login",
      type: "Technical",
      priority: "Critical",
      incidentDate: "2025-06-24",
      description: "The mobile app crashes every time I try to login.",
      expectedResolution: "Please fix the bug as soon as possible.",
      viewed: false,
      accepted: true,
      status: "Resolved",
      reply: "Issue has been fixed in the latest update. Please update your app.",
      image: null,
      video: "crash_video.mp4",
      document: null,
      submittedAt: "June 25, 2025, 2:45 PM"
    }
  ];

  useEffect(() => {
    const saved = localStorage.getItem("complaints");
    if (saved) {
      setComplaints(JSON.parse(saved));
    } else {
      // Load default data if nothing exists
      setComplaints(defaultComplaints);
      localStorage.setItem("complaints", JSON.stringify(defaultComplaints));
    }
  }, []);

  const updateComplaint = (id, updates) => {
    const updated = complaints.map(c =>
      c.id === id ? { ...c, ...updates } : c
    );
    setComplaints(updated);
    localStorage.setItem("complaints", JSON.stringify(updated));
  };

  // Group complaints by email
  const groupedByUser = complaints.reduce((acc, complaint) => {
    const email = complaint.email;
    if (!acc[email]) {
      acc[email] = {
        fullName: complaint.fullName,
        email: email,
        phone: complaint.phone,
        complaints: []
      };
    }
    acc[email].complaints.push(complaint);
    return acc;
  }, {});

  const userList = Object.values(groupedByUser);

  return (
    <div className="admin-container">
      <h1>Admin Dashboard - Complaint Management</h1>

      {!selectedUser ? (
        <div className="user-list">
          <h2>All Complainants ({userList.length})</h2>
          {userList.length === 0 ? (
            <p>No complaints yet.</p>
          ) : (
            userList.map(user => (
              <div className="user-card" key={user.email} onClick={() => setSelectedUser(user)}>
                <h3>{user.fullName}</h3>
                <p>{user.email}</p>
                <p><strong>Complaints:</strong> {user.complaints.length}</p>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="user-detail">
          <button onClick={() => setSelectedUser(null)} className="back-btn">← Back to All Users</button>
          
          <h2>{selectedUser.fullName}</h2>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Phone:</strong> {selectedUser.phone || "N/A"}</p>

          <h3>All Complaints from this User</h3>
          {selectedUser.complaints.map(comp => (
            <div className="admin-complaint-card" key={comp.id}>
              <div className="admin-card-header">
                <h4>{comp.title}</h4>
                <span className={`status ${comp.status.toLowerCase()}`}>{comp.status}</span>
              </div>

              <div className="admin-card-body">
                <p><strong>Type:</strong> {comp.type} | <strong>Priority:</strong> {comp.priority}</p>
                <p><strong>Description:</strong> {comp.description}</p>
                {comp.incidentDate && <p><strong>Incident Date:</strong> {comp.incidentDate}</p>}

                <div className="admin-controls">
                  <select
                    value={comp.status}
                    onChange={(e) => updateComplaint(comp.id, { status: e.target.value })}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>

                  <label>
                    <input
                      type="checkbox"
                      checked={comp.viewed}
                      onChange={(e) => updateComplaint(comp.id, { viewed: e.target.checked })}
                    /> Viewed
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={comp.accepted}
                      onChange={(e) => updateComplaint(comp.id, { accepted: e.target.checked })}
                    /> Accepted
                  </label>
                </div>

                <textarea
                  placeholder="Write reply to user..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows="3"
                />
                <button onClick={() => {
                  if (replyText.trim()) {
                    updateComplaint(comp.id, { reply: replyText });
                    setReplyText("");
                  }
                }}>
                  Send Reply
                </button>

                <p><strong>Current Reply:</strong> {comp.reply}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPage;