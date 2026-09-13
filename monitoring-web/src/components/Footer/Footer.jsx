import React, { Component } from "react";

class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "22px", height: "22px", borderRadius: "5px",
              background: "linear-gradient(135deg, #f59e0b, #ea580c)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontSize: "12px"
            }}>
              <i className="pe-7s-sun" />
            </div>
            <span style={{ fontWeight: 700, fontSize: "13px", color: "var(--solaris-text-primary)", letterSpacing: "1px" }}>
              SOLARIS
            </span>
            <span style={{ fontSize: "12px", color: "var(--solaris-text-muted)" }}>
              Solar Energy Management &amp; Monitoring Platform
            </span>
          </div>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--solaris-text-muted)" }}>
            &copy; {new Date().getFullYear()} &middot; Engineering Internship Project &middot;{" "}
            <span style={{ color: "var(--solaris-text-light)" }}>
              Built on{" "}
              <a
                href="https://github.com/creativetimofficial/light-bootstrap-dashboard-react"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--solaris-sky)", textDecoration: "none" }}
              >
                Light Bootstrap Dashboard React
              </a>{" "}
              (MIT)
            </span>
          </p>
        </div>
      </footer>
    );
  }
}

export default Footer;
