import React, { Component } from "react";
import axios from "axios";

const API = "http://localhost:3001";

class Alerts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alerts: [],
      loading: true,
      filterSeverity: "All",
      filterStatus: "All",
      acknowledging: null
    };
  }

  componentDidMount() {
    this.fetchAlerts();
  }

  fetchAlerts() {
    axios.get(`${API}/api/alerts`)
      .then(res => this.setState({ alerts: res.data || [], loading: false }))
      .catch(() => this.setState({ loading: false }));
  }

  acknowledgeAlert = (alertId) => {
    this.setState({ acknowledging: alertId });
    axios.post(`${API}/api/alerts/${alertId}/acknowledge`)
      .then(() => {
        this.setState(prev => ({
          alerts: prev.alerts.map(a => a.id === alertId ? { ...a, status: "acknowledged" } : a),
          acknowledging: null
        }));
      })
      .catch(() => this.setState({ acknowledging: null }));
  };

  getSeverityConfig(severity) {
    const s = (severity || "info").toLowerCase();
    return {
      critical: { icon: "fa-exclamation-circle", color: "#dc2626", bg: "#fef2f2", border: "#fecaca", label: "CRITICAL" },
      warning:  { icon: "fa-exclamation-triangle", color: "#d97706", bg: "#fffbeb", border: "#fde68a", label: "WARNING" },
      info:     { icon: "fa-info-circle", color: "#0284c7", bg: "#f0f9ff", border: "#bae6fd", label: "INFO" }
    }[s] || { icon: "fa-info-circle", color: "#64748b", bg: "#f8fafc", border: "#e2e8f0", label: "INFO" };
  }

  timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  render() {
    const { alerts, loading, filterSeverity, filterStatus, acknowledging } = this.state;

    const filtered = alerts.filter(a => {
      const matchSev = filterSeverity === "All" || a.severity.toLowerCase() === filterSeverity.toLowerCase();
      const matchSta = filterStatus === "All" || a.status === filterStatus;
      return matchSev && matchSta;
    });

    const critical     = alerts.filter(a => a.severity === "critical").length;
    const warnings     = alerts.filter(a => a.severity === "warning").length;
    const info         = alerts.filter(a => a.severity === "info").length;
    const active       = alerts.filter(a => a.status === "active").length;
    const acknowledged = alerts.filter(a => a.status === "acknowledged").length;

    return (
      <div className="content">
        <div className="solaris-page-header">
          <div>
            <h2 className="solaris-section-title">System Alerts</h2>
            <p className="solaris-section-subtitle">
              {active} active · {acknowledged} acknowledged · {alerts.length} total
            </p>
          </div>
          {active > 0 && (
            <span className="severity-critical" style={{ fontSize: "13px", padding: "6px 14px" }}>
              <i className="fa fa-exclamation-triangle" />
              {active} alert{active > 1 ? "s" : ""} require attention
            </span>
          )}
          {active === 0 && !loading && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#065f46",
              fontSize: "13px", fontWeight: 600, padding: "6px 14px", borderRadius: "9999px"
            }}>
              <i className="fa fa-check-circle" /> All clear
            </span>
          )}
        </div>

        {/* Severity summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Critical",     value: critical,     color: "#dc2626", bg: "#fef2f2", border: "#fecaca", icon: "fa fa-exclamation-circle" },
            { label: "Warnings",     value: warnings,     color: "#d97706", bg: "#fffbeb", border: "#fde68a", icon: "fa fa-exclamation-triangle" },
            { label: "Info",         value: info,         color: "#0284c7", bg: "#f0f9ff", border: "#bae6fd", icon: "fa fa-info-circle" },
            { label: "Acknowledged", value: acknowledged, color: "#64748b", bg: "#f8fafc", border: "#e2e8f0", icon: "fa fa-check" }
          ].map((s, i) => (
            <div key={i} style={{
              background: s.bg, border: `1px solid ${s.border}`,
              borderRadius: "10px", padding: "16px 20px",
              display: "flex", alignItems: "center", gap: "14px",
              boxShadow: "var(--solaris-shadow-sm)"
            }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "white", border: `1px solid ${s.border}`, color: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>
                <i className={s.icon} />
              </div>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", color: s.color }}>{s.label}</div>
                <div style={{ fontSize: "26px", fontWeight: 800, color: s.color, lineHeight: 1.1 }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters + Alert list */}
        <div className="solaris-chart-card">
          <div className="solaris-chart-header">
            <div>
              <p className="solaris-card-title">Alert Feed</p>
              <p className="solaris-card-subtitle">{filtered.length} alerts shown</p>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
              <div className="solaris-btn-group">
                {["All", "active", "acknowledged"].map(s => (
                  <button key={s}
                    className={`solaris-btn-tab${filterStatus === s ? " active" : ""}`}
                    onClick={() => this.setState({ filterStatus: s })}>
                    {s === "active" ? "Active" : s === "acknowledged" ? "Acknowledged" : "All"}
                  </button>
                ))}
              </div>
              <div className="solaris-btn-group">
                {["All", "critical", "warning", "info"].map(s => (
                  <button key={s}
                    className={`solaris-btn-tab${filterSeverity === s ? " active" : ""}`}
                    onClick={() => this.setState({ filterSeverity: s })}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "48px", color: "var(--solaris-text-muted)" }}>
              <i className="fa fa-spinner fa-spin" style={{ fontSize: "24px", marginBottom: "12px", display: "block" }} />
              Loading alerts…
            </div>
          ) : filtered.length === 0 ? (
            <div className="solaris-empty-state">
              <i className="fa fa-check-circle" style={{ color: "#10b981" }} />
              <p>No alerts match your current filter</p>
            </div>
          ) : filtered.map(alert => {
            const cfg = this.getSeverityConfig(alert.severity);
            return (
              <div key={alert.id} style={{
                padding: "18px 24px",
                borderBottom: "1px solid var(--solaris-border)",
                borderLeft: `4px solid ${cfg.color}`,
                background: alert.status === "acknowledged" ? "#fafafa" : "white",
                display: "flex", gap: "16px", alignItems: "flex-start",
                opacity: alert.status === "acknowledged" ? 0.7 : 1,
                transition: "opacity 0.2s"
              }}>
                {/* Icon */}
                <div style={{
                  width: "40px", height: "40px", borderRadius: "10px",
                  background: cfg.bg, border: `1px solid ${cfg.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: cfg.color, fontSize: "18px", flexShrink: 0
                }}>
                  <i className={`fa ${cfg.icon}`} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "4px", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: "14.5px", color: "var(--solaris-text-primary)" }}>{alert.title}</span>
                    <span style={{
                      fontSize: "10.5px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px",
                      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
                      textTransform: "uppercase", letterSpacing: "0.5px"
                    }}>{cfg.label}</span>
                    {alert.status === "acknowledged" && (
                      <span className="solaris-badge badge-info" style={{ fontSize: "10.5px" }}>Acknowledged</span>
                    )}
                  </div>
                  <p style={{ margin: "0 0 8px 0", fontSize: "13.5px", color: "var(--solaris-text-secondary)", lineHeight: 1.5 }}>
                    {alert.message}
                  </p>
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "var(--solaris-text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                      <i className="pe-7s-map-marker" style={{ fontSize: "13px" }} />
                      {alert.installation_name}
                    </span>
                    <span style={{ fontSize: "12px", color: "var(--solaris-text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                      <i className="fa fa-clock-o" style={{ fontSize: "12px" }} />
                      {this.timeAgo(alert.created_at)}
                    </span>
                  </div>
                </div>

                {/* Action */}
                {alert.status === "active" && (
                  <button
                    className="solaris-btn-outline"
                    style={{ fontSize: "12px", padding: "6px 14px", flexShrink: 0 }}
                    disabled={acknowledging === alert.id}
                    onClick={() => this.acknowledgeAlert(alert.id)}
                  >
                    {acknowledging === alert.id
                      ? <><i className="fa fa-spinner fa-spin" style={{ marginRight: "6px" }} />Processing</>
                      : <><i className="fa fa-check" style={{ marginRight: "6px" }} />Acknowledge</>
                    }
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Alerts;
