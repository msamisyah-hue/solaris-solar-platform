import React, { Component } from "react";
import axios from "axios";

const API = "http://localhost:3001";

class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stats: null,
      installations: [],
      alerts: [],
      maintenance: [],
      loading: true,
      reportDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })
    };
  }

  componentDidMount() {
    Promise.all([
      axios.get(`${API}/api/system_stats`).catch(() => null),
      axios.get(`${API}/api/installations`).catch(() => ({ data: [] })),
      axios.get(`${API}/api/alerts`).catch(() => ({ data: [] })),
      axios.get(`${API}/api/maintenance`).catch(() => ({ data: [] }))
    ]).then(([sRes, iRes, aRes, mRes]) => {
      this.setState({
        stats: sRes ? sRes.data : null,
        installations: iRes.data || [],
        alerts: aRes.data || [],
        maintenance: mRes.data || [],
        loading: false
      });
    });
  }

  handlePrint = () => { window.print(); };

  fmt(val, d = 1) {
    if (val === null || val === undefined) return "—";
    return parseFloat(val).toFixed(d);
  }

  render() {
    const { stats, installations, alerts, maintenance, loading, reportDate } = this.state;

    const activeAlerts    = alerts.filter(a => a.status === "active").length;
    const criticalAlerts  = alerts.filter(a => a.severity === "critical").length;
    const scheduledTasks  = maintenance.filter(m => m.status === "Scheduled").length;
    const completedTasks  = maintenance.filter(m => m.status === "Completed").length;
    const totalCapacity   = installations.reduce((s, i) => s + parseFloat(i.capacity_kw || 0), 0);
    const totalYield      = installations.reduce((s, i) => s + parseFloat(i.daily_yield_kwh || 0), 0);
    const avgEfficiency   = installations.length > 0
      ? (installations.reduce((s, i) => s + parseFloat(i.efficiency || 0), 0) / installations.length).toFixed(1)
      : "—";

    if (loading) {
      return (
        <div className="content" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
          <div style={{ textAlign: "center", color: "var(--solaris-text-muted)" }}>
            <i className="fa fa-spinner fa-spin" style={{ fontSize: "28px", display: "block", marginBottom: "12px" }} />
            Generating report…
          </div>
        </div>
      );
    }

    return (
      <div className="content">
        {/* Controls - hidden on print */}
        <div className="solaris-page-header no-print">
          <div>
            <h2 className="solaris-section-title">Reports</h2>
            <p className="solaris-section-subtitle">Portfolio summary · {reportDate}</p>
          </div>
          <button className="solaris-btn-primary" onClick={this.handlePrint}>
            <i className="fa fa-print" /> Print / Export PDF
          </button>
        </div>

        {/* === REPORT DOCUMENT === */}
        <div id="solaris-report" style={{ background: "white", borderRadius: "12px", border: "1px solid var(--solaris-border)", boxShadow: "var(--solaris-shadow-sm)", overflow: "hidden" }}>
          
          {/* Report header */}
          <div style={{ padding: "32px 36px 24px 36px", borderBottom: "1px solid var(--solaris-border)" }}>
            <div className="solaris-report-header" style={{ marginBottom: "0" }}>
              <div className="solaris-report-logo">
                <div className="solaris-report-logo-icon">
                  <i className="pe-7s-sun" />
                </div>
                <div className="solaris-report-logo-text">
                  <div className="name">SOLARIS</div>
                  <div className="subtitle">Solar Energy Management &amp; Monitoring Platform</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "13px", color: "var(--solaris-text-muted)", fontWeight: 500 }}>Portfolio Report</div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--solaris-text-primary)" }}>{reportDate}</div>
                <div style={{ fontSize: "12px", color: "var(--solaris-text-muted)", marginTop: "2px" }}>Demonstration Data · Local Simulation</div>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div style={{ padding: "28px 36px", borderBottom: "1px solid var(--solaris-border)" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--solaris-text-primary)", margin: "0 0 20px 0", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "3px", height: "18px", background: "#f59e0b", borderRadius: "2px", display: "inline-block" }} />
              Executive Summary
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
              {[
                { label: "Total Installations",    value: stats ? stats.total_installations : "—",                unit: "" },
                { label: "Total Installed Capacity", value: totalCapacity.toFixed(0),                             unit: "kWp" },
                { label: "Energy Produced Today",   value: totalYield.toLocaleString(),                           unit: "kWh" },
                { label: "Portfolio Efficiency",    value: avgEfficiency,                                         unit: "%" },
                { label: "Active Panels",           value: stats ? stats.total_panels : "—",                      unit: "" },
                { label: "Current Power Output",    value: stats ? this.fmt(stats.total_current_power_kw, 1) : "—", unit: "kW" },
                { label: "Active Alerts",           value: activeAlerts,                                          unit: "" },
                { label: "CO₂ Offset Today",        value: stats ? stats.co2_offset_tonnes : "—",                unit: "t" }
              ].map((m, i) => (
                <div key={i} style={{ background: "#f8fafc", borderRadius: "8px", padding: "14px 16px", border: "1px solid var(--solaris-border)" }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", color: "var(--solaris-text-muted)", letterSpacing: "0.4px", marginBottom: "4px" }}>{m.label}</div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--solaris-text-primary)", lineHeight: 1 }}>
                    {m.value}
                    {m.unit && <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--solaris-text-muted)", marginLeft: "4px" }}>{m.unit}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Installations table */}
          <div style={{ padding: "28px 36px", borderBottom: "1px solid var(--solaris-border)" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--solaris-text-primary)", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "3px", height: "18px", background: "#0284c7", borderRadius: "2px", display: "inline-block" }} />
              Installation Portfolio
            </h3>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Installation", "Region", "Capacity (kWp)", "Panels", "Yield Today (kWh)", "Efficiency (%)", "Status"].map((h, i) => (
                    <th key={i} style={{ padding: "10px 14px", borderBottom: "2px solid var(--solaris-border)", textAlign: "left", fontWeight: 700, color: "var(--solaris-text-muted)", fontSize: "11.5px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {installations.map(inst => (
                  <tr key={inst.id} style={{ borderBottom: "1px solid var(--solaris-border)" }}>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ fontWeight: 600, color: "var(--solaris-text-primary)" }}>{inst.name}</div>
                      <div style={{ fontSize: "11.5px", color: "var(--solaris-text-muted)", fontFamily: "monospace" }}>{inst.code}</div>
                    </td>
                    <td style={{ padding: "12px 14px", color: "var(--solaris-text-secondary)" }}>{inst.region}</td>
                    <td style={{ padding: "12px 14px", fontWeight: 600 }}>{inst.capacity_kw}</td>
                    <td style={{ padding: "12px 14px" }}>{inst.panels_count.toLocaleString()}</td>
                    <td style={{ padding: "12px 14px", fontWeight: 600 }}>{parseFloat(inst.daily_yield_kwh).toLocaleString()}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ fontWeight: 700, color: inst.efficiency >= 91 ? "#10b981" : inst.efficiency >= 85 ? "#f59e0b" : "#ef4444" }}>
                        {parseFloat(inst.efficiency).toFixed(1)}%
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{
                        padding: "3px 10px", borderRadius: "9999px", fontSize: "11.5px", fontWeight: 600,
                        background: inst.status === "Operational" ? "#ecfdf5" : inst.status === "Warning" ? "#fffbeb" : "#eff6ff",
                        color: inst.status === "Operational" ? "#065f46" : inst.status === "Warning" ? "#92400e" : "#1e40af",
                        border: inst.status === "Operational" ? "1px solid #a7f3d0" : inst.status === "Warning" ? "1px solid #fde68a" : "1px solid #bfdbfe"
                      }}>{inst.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Alerts summary */}
          <div style={{ padding: "28px 36px", borderBottom: "1px solid var(--solaris-border)" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--solaris-text-primary)", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "3px", height: "18px", background: "#ef4444", borderRadius: "2px", display: "inline-block" }} />
              System Alerts Summary
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "16px" }}>
              {[
                { label: "Critical",     value: criticalAlerts, color: "#dc2626" },
                { label: "Active",       value: activeAlerts,   color: "#f59e0b" },
                { label: "Acknowledged", value: alerts.filter(a => a.status === "acknowledged").length, color: "#10b981" }
              ].map((m, i) => (
                <div key={i} style={{ background: "#f8fafc", borderRadius: "8px", padding: "14px 16px", border: "1px solid var(--solaris-border)", textAlign: "center" }}>
                  <div style={{ fontSize: "28px", fontWeight: 800, color: m.color }}>{m.value}</div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--solaris-text-muted)", textTransform: "uppercase" }}>{m.label}</div>
                </div>
              ))}
            </div>
            {alerts.filter(a => a.status === "active").slice(0, 3).map(alert => (
              <div key={alert.id} style={{
                padding: "10px 14px", borderRadius: "6px", marginBottom: "6px",
                background: alert.severity === "critical" ? "#fef2f2" : alert.severity === "warning" ? "#fffbeb" : "#f0f9ff",
                border: `1px solid ${alert.severity === "critical" ? "#fecaca" : alert.severity === "warning" ? "#fde68a" : "#bae6fd"}`,
                display: "flex", gap: "10px", alignItems: "center"
              }}>
                <i className={`fa ${alert.severity === "critical" ? "fa-exclamation-circle" : alert.severity === "warning" ? "fa-exclamation-triangle" : "fa-info-circle"}`}
                  style={{ color: alert.severity === "critical" ? "#dc2626" : alert.severity === "warning" ? "#d97706" : "#0284c7", fontSize: "15px" }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: "13px" }}>{alert.title}</div>
                  <div style={{ fontSize: "12px", color: "var(--solaris-text-muted)" }}>{alert.installation_name}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Maintenance summary */}
          <div style={{ padding: "28px 36px", borderBottom: "1px solid var(--solaris-border)" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--solaris-text-primary)", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "3px", height: "18px", background: "#3b82f6", borderRadius: "2px", display: "inline-block" }} />
              Maintenance Overview
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
              {[
                { label: "Scheduled",   value: scheduledTasks,  color: "#3b82f6" },
                { label: "Completed",   value: completedTasks,  color: "#10b981" },
                { label: "In Progress", value: maintenance.filter(m => m.status === "In Progress").length, color: "#f59e0b" }
              ].map((m, i) => (
                <div key={i} style={{ background: "#f8fafc", borderRadius: "8px", padding: "14px 16px", border: "1px solid var(--solaris-border)", textAlign: "center" }}>
                  <div style={{ fontSize: "28px", fontWeight: 800, color: m.color }}>{m.value}</div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--solaris-text-muted)", textTransform: "uppercase" }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Report footer */}
          <div style={{ padding: "20px 36px", background: "#f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "12px", color: "var(--solaris-text-muted)" }}>
              SOLARIS Energy Platform · Demonstration Data · Local Simulation
            </div>
            <div style={{ fontSize: "12px", color: "var(--solaris-text-muted)" }}>
              Generated {reportDate}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Reports;
