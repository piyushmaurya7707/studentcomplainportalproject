import React, { useState, useMemo } from "react";
import "./AdminPage.css";

import {
  Search, MapPin, IndianRupee, Clock, Eye, CheckCircle2,
  MessageSquare, X, Flame, Filter, ChevronRight
} from "lucide-react";

// ==================== CONFIG ====================
const STATES = ["Gujarat", "Maharashtra", "Delhi", "Karnataka", "Rajasthan"];

const TIERS = {
  low: { label: "Low", price: 10, color: "tier-low" },
  high: { label: "High", price: 100, color: "tier-high" },
  important: { label: "Important", price: 400, color: "tier-important" },
};

// ==================== DEFAULT COMPLAINTS ====================
const seedComplaints = [
  // Free Complaints
  { id: 1001, title: "Bus Delay", fullName: "Piyush Sharma", state: "Gujarat", description: "College bus is coming very late every day.", type: "Transport", status: "Pending", isPaid: false, paidTier: null, submittedAt: "July 12, 2026, 09:15 AM" },
  { id: 1002, title: "WiFi Not Working", fullName: "Neha Patel", state: "Maharashtra", description: "Hostel WiFi is very slow.", type: "Technical", status: "Pending", isPaid: false, paidTier: null, submittedAt: "July 12, 2026, 10:30 AM" },
  { id: 1003, title: "Mess Food Quality", fullName: "Rahul Verma", state: "Delhi", description: "Food in mess is not good.", type: "Facilities", status: "Pending", isPaid: false, paidTier: null, submittedAt: "July 12, 2026, 08:45 AM" },

  // Low Tier (₹10)
  { id: 2001, title: "Water Cooler Issue", fullName: "Amit Kumar", state: "Gujarat", description: "Water cooler not working properly.", type: "Facilities", status: "Pending", isPaid: true, paidTier: "low", submittedAt: "July 11, 2026, 02:15 PM" },

  // High Tier (₹100)
  { id: 3001, title: "Exam Fee Error", fullName: "Rohan Malhotra", state: "Delhi", description: "Wrong fee deducted.", type: "Billing", status: "Pending", isPaid: true, paidTier: "high", submittedAt: "July 12, 2026, 09:05 AM" },

  // Important Tier (₹400)
  { id: 4001, title: "App Crashing on Login", fullName: "Vikas Reddy", state: "Karnataka", description: "App crashes during login.", type: "Technical", status: "Pending", isPaid: true, paidTier: "important", submittedAt: "July 12, 2026, 07:55 AM" },
];

// ==================== COMPONENTS ====================
function Badge({ children, type = "" }) {
  return <span className={`badge ${type}`}>{children}</span>;
}

function ComplaintCard({ complaint, onOpen, commonCount, tierInfo }) {
  return (
    <button className="complaint-card" onClick={() => onOpen(complaint)}>
      {tierInfo && <div className={`tier-bar ${tierInfo.color}`} />}
      <div className="card-content">
        <div className="card-header">
          <div>
            <h4 className="card-title">{complaint.title}</h4>
            <p className="card-meta">{complaint.fullName} • {complaint.state}</p>
            <p className="card-desc">{complaint.description}</p>
          </div>
          <ChevronRight size={20} className="card-chevron" />
        </div>

        <div className="card-badges">
          <Badge type={`status-${complaint.status.toLowerCase().replace(/\s+/g, "-")}`}>{complaint.status}</Badge>
          <Badge type="neutral">{complaint.type}</Badge>
          {tierInfo && <Badge type={`tier-${complaint.paidTier}`}>₹{tierInfo.price}</Badge>}
          <span className="card-date"><Clock size={14} /> {complaint.submittedAt.split(",")[0]}</span>
        </div>
      </div>
    </button>
  );
}

// ==================== MAIN APP ====================
export default function AdminPage() {
  const [complaints, setComplaints] = useState(seedComplaints);
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("All States");
  const [commonOnly, setCommonOnly] = useState(false);
  const [activeTier, setActiveTier] = useState("low");

  const updateComplaint = (id, updates) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    if (selected?.id === id) setSelected(prev => ({ ...prev, ...updates }));
  };

  const titleCounts = useMemo(() => {
    const map = {};
    complaints.forEach(c => map[c.title] = (map[c.title] || 0) + 1);
    return map;
  }, [complaints]);

  const filtered = complaints.filter(c => {
    const matchSearch = !search || 
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.fullName.toLowerCase().includes(search.toLowerCase());
    const matchState = stateFilter === "All States" || c.state === stateFilter;
    const matchCommon = !commonOnly || titleCounts[c.title] > 1;
    return matchSearch && matchState && matchCommon;
  });

  const freeComplaints = filtered.filter(c => !c.isPaid);
  const paidComplaints = filtered.filter(c => c.isPaid && c.paidTier === activeTier);

  const handleApprove = () => {
    if (selected) {
      updateComplaint(selected.id, { status: "Resolved" });
      setReplyText("Your complaint has been approved and resolved.");
    }
  };

  const handleReject = () => {
    if (selected) {
      updateComplaint(selected.id, { status: "Rejected" });
      setReplyText("Your complaint has been rejected.");
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Complaint Management - Admin</h1>
        <p>{complaints.length} Total Complaints</p>
      </header>

      <div className="admin-toolbar">
        <div className="toolbar-container">
          <div className="search-box">
            <Search size={18} />
            <input placeholder="Search complaints..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <div className="state-box">
            <MapPin size={18} />
            <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
              <option>All States</option>
              {STATES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <button className={`common-btn ${commonOnly ? "active" : ""}`} onClick={() => setCommonOnly(!commonOnly)}>
            <Filter size={18} /> Common Only
          </button>
        </div>
      </div>

      <div className="main-content">
        {/* Left - Free */}
        <div className="section left-section">
          <h2>Recent Complaints (Free)</h2>
          <div className="cards-container">
            {freeComplaints.length === 0 ? <p className="empty">No free complaints</p> : 
              freeComplaints.map(c => <ComplaintCard key={c.id} complaint={c} onOpen={setSelected} commonCount={titleCounts[c.title]} />)}
          </div>
        </div>

        {/* Right - Paid */}
        <div className="section right-section">
          <h2>Paid / Urgent Complaints</h2>
          <div className="tier-tabs">
            {Object.entries(TIERS).map(([key, tier]) => (
              <button key={key} className={`tier-tab ${activeTier === key ? "active" : ""}`} onClick={() => setActiveTier(key)}>
                {tier.label} <span className="price">₹{tier.price}</span>
              </button>
            ))}
          </div>
          <div className="cards-container">
            {paidComplaints.length === 0 ? (
              <p className="empty">No {TIERS[activeTier].label} tier complaints</p>
            ) : (
              paidComplaints.map(c => <ComplaintCard key={c.id} complaint={c} onOpen={setSelected} commonCount={titleCounts[c.title]} tierInfo={TIERS[c.paidTier]} />)
            )}
          </div>
        </div>
      </div>

      {/* Modal with Approve & Reject */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selected.title}</h3>
              <button onClick={() => setSelected(null)} className="close-btn"><X size={26} /></button>
            </div>

            <div className="modal-body">
              <p><strong>Student:</strong> {selected.fullName}</p>
              <p><strong>State:</strong> {selected.state}</p>
              <p><strong>Description:</strong> {selected.description}</p>
              <p><strong>Current Status:</strong> <strong>{selected.status}</strong></p>

              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write reply or reason..."
                rows={4}
              />

              <div className="action-buttons">
                <button className="approve-btn" onClick={handleApprove}>
                   Approve
                </button>
                <button className="reject-btn" onClick={handleReject}>
                   Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );


}
