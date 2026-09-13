import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "profile",
      profile: { name: "Admin Engineer", email: "admin@solaris.demo", role: "System Administrator", org: "SOLARIS Demo Platform" },
      monitoring: { refreshInterval: "10", tempUnit: "Celsius", voltageThreshold: "10.5", tempThreshold: "65", effThreshold: "85" },
      notifications: { emailAlerts: true, criticalOnly: false, weeklyReport: true, maintenanceReminders: true },
      system: { darkMode: false, compactView: false, showDemoLabel: true },
      saved: false
    };
  }

  handleToggle = (section, key) => {
    this.setState(prev => ({
      [section]: { ...prev[section], [key]: !prev[section][key] }
    }));
  };

  handleChange = (section, key, value) => {
    this.setState(prev => ({
      [section]: { ...prev[section], [key]: value }
    }));
  };

  handleSave = () => {
    this.setState({ saved: true });
    setTimeout(() => this.setState({ saved: false }), 2500);
  };

  renderToggle(section, key, title, desc) {
    const on = this.state[section][key];
    return (
      <div className="solaris-toggle" key={key}>
        <div className="solaris-toggle-label">
          <span className="solaris-toggle-title">{title}</span>
          <span className="solaris-toggle-desc">{desc}</span>
        </div>
        <button className={`solaris-switch ${on ? "on" : "off"}`} onClick={() => this.handleToggle(section, key)} aria-label={title} />
      </div>
    );
  }

  render() {
    const { activeTab, profile, monitoring, saved } = this.state;

    return (
      <div className="content">
        <div className="solaris-page-header">
          <div>
            <h2 className="solaris-section-title">Settings</h2>
            <p className="solaris-section-subtitle">Platform configuration &amp; preferences</p>
          </div>
          <button className="solaris-btn-primary" onClick={this.handleSave}>
            <i className="fa fa-save" /> Save Changes
          </button>
        </div>

        {saved && (
          <div style={{
            background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: "8px",
            padding: "12px 16px", marginBottom: "20px", color: "#065f46",
            fontSize: "13.5px", display: "flex", alignItems: "center", gap: "8px"
          }}>
            <i className="fa fa-check-circle" /> Settings saved successfully.
          </div>
        )}

        <Grid fluid style={{ padding: 0 }}>
          <Row>
            {/* Left: Tab nav */}
            <Col md={3}>
              <div className="solaris-chart-card" style={{ padding: "8px" }}>
                {[
                  { key: "profile",       label: "Profile",              icon: "fa fa-user" },
                  { key: "monitoring",    label: "Monitoring",           icon: "pe-7s-signal" },
                  { key: "notifications", label: "Notifications",        icon: "fa fa-bell" },
                  { key: "system",        label: "System",               icon: "fa fa-cog" },
                  { key: "about",         label: "About",                icon: "fa fa-info-circle" }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => this.setState({ activeTab: tab.key })}
                    style={{
                      width: "100%", textAlign: "left", padding: "11px 14px",
                      border: "none", borderRadius: "8px", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: "10px",
                      background: activeTab === tab.key ? "rgba(245,158,11,0.1)" : "transparent",
                      color: activeTab === tab.key ? "#d97706" : "var(--solaris-text-secondary)",
                      fontWeight: activeTab === tab.key ? 700 : 500,
                      fontSize: "13.5px",
                      marginBottom: "2px",
                      transition: "all 0.15s",
                      borderLeft: activeTab === tab.key ? "3px solid #f59e0b" : "3px solid transparent"
                    }}
                  >
                    <i className={tab.icon} style={{ fontSize: "15px", width: "16px", textAlign: "center" }} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </Col>

            {/* Right: Content */}
            <Col md={9}>
              <div className="solaris-chart-card">

                {/* Profile */}
                {activeTab === "profile" && (
                  <div>
                    <div className="solaris-chart-header">
                      <p className="solaris-card-title">Profile Settings</p>
                    </div>
                    <div style={{ padding: "24px" }}>
                      {/* Avatar area */}
                      <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "28px", paddingBottom: "24px", borderBottom: "1px solid var(--solaris-border)" }}>
                        <div style={{
                          width: "72px", height: "72px", borderRadius: "50%",
                          background: "linear-gradient(135deg, #0284c7, #0369a1)",
                          color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "26px", fontWeight: 800
                        }}>
                          AD
                        </div>
                        <div>
                          <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--solaris-text-primary)" }}>{profile.name}</div>
                          <div style={{ fontSize: "13px", color: "var(--solaris-text-muted)" }}>{profile.role}</div>
                          <div style={{ fontSize: "13px", color: "var(--solaris-text-muted)" }}>{profile.org}</div>
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        {[
                          { label: "Full Name",         key: "name",  type: "text" },
                          { label: "Email Address",     key: "email", type: "email" },
                          { label: "Role",              key: "role",  type: "text" },
                          { label: "Organisation",      key: "org",   type: "text" }
                        ].map(f => (
                          <div key={f.key} className="solaris-form-group">
                            <label className="solaris-form-label">{f.label}</label>
                            <input type={f.type} className="solaris-form-control" value={profile[f.key]} onChange={e => this.handleChange("profile", f.key, e.target.value)} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Monitoring */}
                {activeTab === "monitoring" && (
                  <div>
                    <div className="solaris-chart-header">
                      <p className="solaris-card-title">Monitoring Preferences</p>
                    </div>
                    <div style={{ padding: "24px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                        <div className="solaris-form-group">
                          <label className="solaris-form-label">Data Refresh Interval (seconds)</label>
                          <select className="solaris-form-control" value={monitoring.refreshInterval} onChange={e => this.handleChange("monitoring", "refreshInterval", e.target.value)}>
                            <option value="5">5 seconds</option>
                            <option value="10">10 seconds</option>
                            <option value="30">30 seconds</option>
                            <option value="60">1 minute</option>
                          </select>
                        </div>
                        <div className="solaris-form-group">
                          <label className="solaris-form-label">Temperature Unit</label>
                          <select className="solaris-form-control" value={monitoring.tempUnit} onChange={e => this.handleChange("monitoring", "tempUnit", e.target.value)}>
                            <option>Celsius</option>
                            <option>Fahrenheit</option>
                          </select>
                        </div>
                        <div className="solaris-form-group">
                          <label className="solaris-form-label">Low Voltage Alert Threshold (V)</label>
                          <input type="number" step="0.1" className="solaris-form-control" value={monitoring.voltageThreshold} onChange={e => this.handleChange("monitoring", "voltageThreshold", e.target.value)} />
                        </div>
                        <div className="solaris-form-group">
                          <label className="solaris-form-label">High Temperature Alert (°C)</label>
                          <input type="number" className="solaris-form-control" value={monitoring.tempThreshold} onChange={e => this.handleChange("monitoring", "tempThreshold", e.target.value)} />
                        </div>
                        <div className="solaris-form-group">
                          <label className="solaris-form-label">Low Efficiency Alert (%)</label>
                          <input type="number" className="solaris-form-control" value={monitoring.effThreshold} onChange={e => this.handleChange("monitoring", "effThreshold", e.target.value)} />
                        </div>
                      </div>
                      <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "8px", padding: "12px 14px", fontSize: "13px", color: "#92400e" }}>
                        <i className="fa fa-info-circle" style={{ marginRight: "6px" }} />
                        Threshold changes are stored locally for demonstration. In production, these would configure backend alert rules.
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications */}
                {activeTab === "notifications" && (
                  <div>
                    <div className="solaris-chart-header">
                      <p className="solaris-card-title">Notification Preferences</p>
                    </div>
                    <div style={{ padding: "24px" }}>
                      {this.renderToggle("notifications", "emailAlerts",          "Email Alerts",             "Receive email notifications for new alerts")}
                      {this.renderToggle("notifications", "criticalOnly",          "Critical Alerts Only",      "Only notify for critical severity alerts")}
                      {this.renderToggle("notifications", "weeklyReport",          "Weekly Summary Report",     "Receive weekly portfolio performance report")}
                      {this.renderToggle("notifications", "maintenanceReminders",  "Maintenance Reminders",     "Get reminded 24h before scheduled maintenance")}
                    </div>
                  </div>
                )}

                {/* System */}
                {activeTab === "system" && (
                  <div>
                    <div className="solaris-chart-header">
                      <p className="solaris-card-title">System Preferences</p>
                    </div>
                    <div style={{ padding: "24px" }}>
                      {this.renderToggle("system", "darkMode",      "Dark Mode",            "Enable dark theme for the interface")}
                      {this.renderToggle("system", "compactView",   "Compact View",         "Use denser layout for tables and cards")}
                      {this.renderToggle("system", "showDemoLabel", "Show Demo Label",      "Display 'Simulation Data' labels throughout the UI")}
                      <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--solaris-border)" }}>
                        <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--solaris-text-primary)", marginBottom: "8px" }}>Data Source</div>
                        <div style={{ background: "#f8fafc", border: "1px solid var(--solaris-border)", borderRadius: "8px", padding: "14px 16px" }}>
                          <div style={{ fontSize: "13px", color: "var(--solaris-text-secondary)", lineHeight: 1.6 }}>
                            <div>Backend API: <strong>http://localhost:3001</strong></div>
                            <div>Database: <strong>MySQL · solar_power_test</strong></div>
                            <div>Simulation interval: <strong>10 seconds</strong></div>
                            <div>Data source: <strong>Local simulation (no IoT hardware required)</strong></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* About */}
                {activeTab === "about" && (
                  <div>
                    <div className="solaris-chart-header">
                      <p className="solaris-card-title">About SOLARIS</p>
                    </div>
                    <div style={{ padding: "28px 24px" }}>
                      <div style={{ display: "flex", gap: "18px", alignItems: "flex-start", marginBottom: "28px", paddingBottom: "24px", borderBottom: "1px solid var(--solaris-border)" }}>
                        <div style={{
                          width: "60px", height: "60px", borderRadius: "12px", flexShrink: 0,
                          background: "linear-gradient(135deg, #f59e0b, #ea580c)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "white", fontSize: "28px", boxShadow: "0 4px 12px rgba(245,158,11,0.3)"
                        }}>
                          <i className="pe-7s-sun" />
                        </div>
                        <div>
                          <div style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "var(--solaris-text-primary)" }}>SOLARIS</div>
                          <div style={{ fontSize: "13px", color: "var(--solaris-text-muted)", marginTop: "2px" }}>Solar Energy Management &amp; Monitoring Platform</div>
                          <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
                            <span style={{ background: "#f1f5f9", padding: "3px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: 600, color: "var(--solaris-text-secondary)" }}>Phase 2</span>
                            <span style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "3px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: 600, color: "#065f46" }}>Internship Demo</span>
                          </div>
                        </div>
                      </div>
                      {[
                        { label: "Frontend",   value: "React 16 · react-router-dom v5 · Bootstrap 3 · Chart.js v2" },
                        { label: "Backend",    value: "Node.js · Express 4 · MySQL 2" },
                        { label: "Database",   value: "MySQL · solar_power_test (local)" },
                        { label: "Charts",     value: "react-chartjs-2 · react-gauge-chart" },
                        { label: "Data",       value: "Simulated sensor telemetry · 10s intervals · Moroccan demo portfolio" }
                      ].map((item, i) => (
                        <div key={i} style={{ display: "flex", gap: "16px", padding: "10px 0", borderBottom: "1px solid #f1f5f9", alignItems: "flex-start" }}>
                          <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", color: "var(--solaris-text-muted)", width: "100px", flexShrink: 0, paddingTop: "1px" }}>{item.label}</div>
                          <div style={{ fontSize: "13.5px", color: "var(--solaris-text-secondary)" }}>{item.value}</div>
                        </div>
                      ))}
                      <div style={{ marginTop: "20px", background: "#f8fafc", borderRadius: "8px", padding: "14px 16px", fontSize: "12.5px", color: "var(--solaris-text-muted)", lineHeight: 1.6 }}>
                        Built on top of the open-source Light Bootstrap Dashboard React (v1.3.0) by Creative Tim (MIT License).
                        The original monitoring foundation was adapted and extended for this engineering internship project.
                        Original license retained in LICENSE.md.
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Settings;
