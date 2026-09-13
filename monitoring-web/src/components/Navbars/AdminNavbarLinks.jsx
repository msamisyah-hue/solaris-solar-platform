import React, { Component } from "react";

// Mobile-only nav links rendered inside the sidebar at small viewports.
// The full topbar is handled by AdminNavbar.jsx.
class AdminNavbarLinks extends Component {
  render() {
    return (
      <li style={{ padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "700",
              fontSize: "11px"
            }}
          >
            AD
          </div>
          <div>
            <div style={{ color: "#f1f5f9", fontSize: "12px", fontWeight: "600" }}>Admin</div>
            <div style={{ color: "#94a3b8", fontSize: "11px" }}>Engineer</div>
          </div>
        </div>
      </li>
    );
  }
}

export default AdminNavbarLinks;
