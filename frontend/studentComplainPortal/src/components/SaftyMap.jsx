import { useState } from "react";

// ─── Mock Data (Parents/Guardians) ───────────────────────────────────────────
const PARENTS = [
  { id: 1, name: "Dad - Ravi Sharma", status: "moving", speed: 48, battery: 82, lat: 23.022, lng: 72.571, heading: 45, lastSeen: "Just now", relation: "Father", phone: "+91 98765 43210" },
  { id: 2, name: "me", status: "stopped", speed: 0, battery: 91, lat: 23.033, lng: 72.585, heading: 180, lastSeen: "2 min ago", relation: "Mother", phone: "+91 98765 43211" },
  { id: 3, name: "Uncle - Mehul Patel", status: "moving", speed: 35, battery: 67, lat: 23.015, lng: 72.558, heading: 90, lastSeen: "Just now", relation: "Uncle", phone: "+91 98765 43212" },
];

const STATUS_COLORS = { moving: "#22c55e", stopped: "#f59e0b", offline: "#6b7280" };
const STATUS_BG = { moving: "#dcfce7", stopped: "#fef3c7", offline: "#f3f4f6" };
const STATUS_TEXT = { moving: "#15803d", stopped: "#92400e", offline: "#374151" };

// ─── Realistic Google Maps Style Mock ───────────────────────────────────────
function MapCanvas({ parents, selected, onSelect }) {
  const lats = parents.map(p => p.lat);
  const lngs = parents.map(p => p.lng);
  const minLat = Math.min(...lats) - 0.018;
  const maxLat = Math.max(...lats) + 0.018;
  const minLng = Math.min(...lngs) - 0.018;
  const maxLng = Math.max(...lngs) + 0.018;

  const toX = (lng) => `${((lng - minLng) / (maxLng - minLng)) * 94 + 3}%`;
  const toY = (lat) => `${(1 - (lat - minLat) / (maxLat - minLat)) * 90 + 5}%`;

  const roads = [[parents[0], parents[1]], [parents[1], parents[2]], [parents[2], parents[0]]];

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "100%",
      background: "#e0e8d8",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(180deg, #d8e4cc 0%, #c8d8b8 100%)`,
      }} />

      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          <pattern id="mapgrid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#b8c9a8" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mapgrid)" />

        {roads.map(([a, b], i) => (
          <g key={i}>
            <line x1={toX(a.lng)} y1={toY(a.lat)} x2={toX(b.lng)} y2={toY(b.lat)} stroke="#475569" strokeWidth="7" strokeLinecap="round" />
            <line x1={toX(a.lng)} y1={toY(a.lat)} x2={toX(b.lng)} y2={toY(b.lat)} stroke="#64748b" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 4" />
          </g>
        ))}
      </svg>

      {/* Fake location labels */}
      <div style={{ position: "absolute", left: "20%", top: "28%", fontSize: "10px", color: "#334155", pointerEvents: "none", fontWeight: 500 }}>Naranpura</div>
      <div style={{ position: "absolute", left: "62%", top: "45%", fontSize: "10px", color: "#334155", pointerEvents: "none", fontWeight: 500 }}>Navrangpura</div>

      {/* Markers */}
      {parents.map((p) => {
        const isSelected = selected === p.id;
        const isMoving = p.status === "moving";

        return (
          <button
            key={p.id}
            onClick={() => onSelect(isSelected ? null : p.id)}
            style={{
              position: "absolute",
              left: toX(p.lng),
              top: toY(p.lat),
              transform: `translate(-50%, -50%) rotate(${p.heading}deg)`,
              background: "none",
              border: "none",
              cursor: "pointer",
              zIndex: isSelected ? 30 : 15,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{
                width: isSelected ? 52 : 42,
                height: isSelected ? 52 : 42,
                borderRadius: "50% 50% 50% 0",
                transform: "rotate(-45deg)",
                background: STATUS_COLORS[p.status],
                border: `4px solid ${isSelected ? "#1e293b" : "#fff"}`,
                boxShadow: isSelected ? "0 8px 30px rgba(0,0,0,0.45)" : "0 4px 16px rgba(0,0,0,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}>
                <span style={{ transform: "rotate(45deg)", fontSize: isSelected ? 26 : 22 }}>👤</span>
                {isMoving && (
                  <div style={{
                    position: "absolute",
                    inset: "-14px",
                    border: `2.5px solid ${STATUS_COLORS[p.status]}99`,
                    borderRadius: "50%",
                    animation: "pulse 2.2s infinite ease-out",
                  }} />
                )}
              </div>
              <div style={{
                background: isSelected ? "#1e293b" : "rgba(255,255,255,0.95)",
                color: isSelected ? "#fff" : "#1e293b",
                fontSize: "10px",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 12,
                marginTop: 4,
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}>
                {p.name.split(" - ")[0]}
              </div>
            </div>
          </button>
        );
      })}

      <div style={{ position: "absolute", bottom: 12, right: 12, fontSize: 10, color: "#64748b", background: "rgba(255,255,255,0.9)", padding: "3px 9px", borderRadius: 4 }}>
        Mock • Ahmedabad
      </div>
    </div>
  );
}

// Parent Card
function ParentCard({ p, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        background: isSelected ? "#f0f9ff" : "#fff",
        border: `1.5px solid ${isSelected ? "#0ea5e9" : "#e2e8f0"}`,
        borderRadius: 12,
        padding: 14,
        textAlign: "left",
        boxShadow: isSelected ? "0 0 0 3px #bae6fd" : "none",
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ fontSize: 32 }}>👤</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>{p.name}</span>
            <span style={{
              fontSize: 11,
              padding: "3px 9px",
              borderRadius: 999,
              background: STATUS_BG[p.status],
              color: STATUS_TEXT[p.status],
              fontWeight: 600
            }}>
              {p.status}
            </span>
          </div>
          <div style={{ color: "#64748b", fontSize: 13 }}>{p.relation}</div>
        </div>
      </div>
    </button>
  );
}

// Detail Panel
function DetailPanel({ parent, onClose }) {
  if (!parent) return null;
  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      padding: 18,
      boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
      border: "1px solid #e2e8f0"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{parent.name}</div>
          <div style={{ color: "#64748b" }}>{parent.relation} • {parent.phone}</div>
        </div>
        <button onClick={onClose} style={{ fontSize: 24, background: "none", border: "none" }}>✕</button>
      </div>

      <div style={{ padding: 12, background: STATUS_BG[parent.status], borderRadius: 12, marginBottom: 16 }}>
        <strong>Status:</strong> {parent.status.toUpperCase()} • {parent.speed} km/h
      </div>

      <button style={{
        width: "100%",
        padding: 14,
        background: "#3b82f6",
        color: "white",
        border: "none",
        borderRadius: 12,
        fontSize: 16,
        fontWeight: 600
      }}>
        📍 Track Live • Call Now
      </button>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function StudentSafetyTracker() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [showList, setShowList] = useState(false); // Mobile list toggle

  const selectedParent = PARENTS.find(p => p.id === selected);

  const filtered = PARENTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.relation.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", height: "100vh", display: "flex", flexDirection: "column", background: "#f8fafc", overflow: "hidden" }}>
      {/* Header */}
      <header style={{ height: 56, background: "#fff", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", padding: "0 16px", justifyContent: "space-between", zIndex: 30 }}>
        <div style={{ fontWeight: 800, fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
          🛡️ <span>Safety Tracker</span>
        </div>
        <div style={{ background: "#f0fdf4", color: "#166534", padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>LIVE</div>
      </header>

      {/* Mobile Tabs */}
      <div style={{ display: "flex", background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
        <button
          onClick={() => setShowList(false)}
          style={{
            flex: 1,
            padding: "12px",
            fontWeight: 600,
            background: !showList ? "#f0f9ff" : "#fff",
            color: !showList ? "#0369a1" : "#64748b",
            borderBottom: !showList ? "3px solid #0ea5e9" : "none"
          }}
        >
          🗺 Map
        </button>
        <button
          onClick={() => setShowList(true)}
          style={{
            flex: 1,
            padding: "12px",
            fontWeight: 600,
            background: showList ? "#f0f9ff" : "#fff",
            color: showList ? "#0369a1" : "#64748b",
            borderBottom: showList ? "3px solid #0ea5e9" : "none"
          }}
        >
          👨‍👩‍👧 Parents
        </button>
      </div>

      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {/* Map View */}
        <div style={{ display: showList ? "none" : "block", height: "100%" }}>
          <MapCanvas parents={filtered} selected={selected} onSelect={setSelected} />

          {/* Floating Stats */}
          <div style={{
            position: "absolute",
            top: 12,
            left: 12,
            background: "white",
            padding: "8px 12px",
            borderRadius: 12,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            fontSize: 13,
            zIndex: 20
          }}>
            {filtered.length} Parents Online
          </div>

          {/* Selected Detail (Mobile Floating) */}
          {selectedParent && (
            <div style={{
              position: "absolute",
              bottom: 16,
              left: 12,
              right: 12,
              zIndex: 25
            }}>
              <DetailPanel parent={selectedParent} onClose={() => setSelected(null)} />
            </div>
          )}
        </div>

        {/* List View (Mobile) */}
        <div style={{
          display: showList ? "block" : "none",
          height: "100%",
          overflowY: "auto",
          padding: "16px",
          background: "#f8fafc"
        }}>
          <input
            placeholder="Search parents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 12,
              border: "1px solid #cbd5e1",
              marginBottom: 16,
              fontSize: 15
            }}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map(p => (
              <ParentCard
                key={p.id}
                p={p}
                isSelected={selected === p.id}
                onClick={() => {
                  setSelected(p.id);
                  setShowList(false); // Switch back to map after selection
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.7); opacity: 0.6; }
          100% { transform: scale(2.3); opacity: 0; }
        }
        * { box-sizing: border-box; }
        button { touch-action: manipulation; }
      `}</style>
    </div>
  );
}