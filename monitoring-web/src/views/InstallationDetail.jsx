import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import DataBaseCard from "components/Card/DataBaseCard";

const API = "http://localhost:3001";

function StatusBadge({ status }) {
  const s = (status || "").toLowerCase();
  const map = { operational: "badge-operational", warning: "badge-warning", maintenance: "badge-maintenance", critical: "badge-critical", optimal: "badge-operational", "sub-optimal": "badge-warning", degraded: "badge-critical", scheduled: "badge-scheduled", "in progress": "badge-in-progress", completed: "badge-completed" };
  const dot = { operational: "#10b981", optimal: "#10b981", completed: "#10b981", warning: "#f59e0b", "sub-optimal": "#f59e0b", "in progress": "#f59e0b", maintenance: "#3b82f6", scheduled: "#3b82f6", critical: "#ef4444", degraded: "#ef4444" };
  return (
    <span className={`solaris-badge ${map[s] || "badge-info"}`}>
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", display: "inline-block", background: dot[s] || "#94a3b8" }} />
      {status}
    </span>
  );
}

const TIME_PERIODS = [
  { label: "1H", value: "L1H" }, { label: "3H", value: "L3H" }, { label: "6H", value: "L6H" },
  { label: "12H", value: "L12H" }, { label: "24H", value: "LD" }, { label: "7D", value: "LW" }, { label: "30D", value: "LM" }
];

class InstallationDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      installation: null,
      loading: true,
      activeTab: "overview",
      timePeriod: "L1H",
      acknowledging: null
    };
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    axios.get(`${API}/api/installations/${id}`)
      .then(res => this.setState({ installation: res.data, loading: false }))
      .catch(() => this.setState({ loading: false }));
  }

  acknowledgeAlert = (alertId) => {
    this.setState({ acknowledging: alertId });
    axios.post(`${API}/api/alerts/${alertId}/acknowledge`)
      .then(() => {
        const { installation } = this.state;
        const updatedAlerts = installation.alerts.map(a =>
          a.id === alertId ? { ...a, status: "acknowledged" } : a
        );
        this.setState({ installation: { ...installation, alerts: updatedAlerts }, acknowledging: null });
      })
      .catch(() => this.setState({ acknowledging: null }));
  };

  render() {
    const { installation, loading, activeTab, timePeriod, acknowledging } = this.state;

    if (loading) {
      return (
        <div className="content" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "300px" }}>
          <div style={{ textAlign: "center", color: "var(--solaris-text-muted)" }}>
            <i className="fa fa-spinner fa-spin" style={{ fontSize: "28px", marginBottom: "12px", display: "block" }} />
            Loading installation data…
          </div>
        </div>
      );
    }

    if (!installation) {
      return (
        <div className="content">
          <Link to="/admin/installations" className="solaris-back-link">
            <i className="fa fa-arrow-left" /> Back to Installations
          </Link>
          <div className="solaris-empty-state">
            <i className="fa fa-exclamation-triangle" />
            <p>Installation not found.</p>
          </div>
        </div>
      );
    }

    const panels = installation.panels || [];
    const alerts = installation.alerts || [];
    const maintenance = installation.maintenance || [];
    const activeAlerts = alerts.filter(a => a.status === "active");

    return (
      <div className="content">
        {/* Back link */}
        <Link to="/admin/installations" className="solaris-back-link">
          <i className="fa fa-arrow-left" /> Back to Installations
        </Link>

        {/* Header */}
        <div style={{
          background: "white", border: "1px solid var(--solaris-border)",
          borderRadius: "12px", padding: "24px 28px", marginBottom: "24px",
          boxShadow: "var(--solaris-shadow-sm)"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", gap: "18px", alignItems: "flex-start" }}>
              <div style={{
                width: "56px", height: "56px", borderRadius: "12px",
                background: "linear-gradient(135deg, #f59e0b, #ea580c)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontSize: "26px", flexShrink: 0,
                boxShadow: "0 4px 12px rgba(245,158,11,0.3)"
              }}>
                <i className="pe-7s-sun" />
              </div>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--solaris-text-primary)", margin: "0 0 4px 0" }}>
                  {installation.name}
                </h2>
                <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "12.5px", color: "var(--solaris-text-muted)", fontFamily: "monospace" }}>{installation.code}</span>
                  <span style={{ fontSize: "12.5px", color: "var(--solaris-text-muted)" }}>
                    <i className="fa fa-map-marker" style={{ marginRight: "4px" }} />{installation.location}
                  </span>
                  <span style={{ fontSize: "12.5px", color: "var(--solaris-text-muted)" }}>{installation.region}</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              {activeAlerts.length > 0 && (
                <span className="severity-warning">
                  <i className="fa fa-exclamation-triangle" /> {activeAlerts.length} alert{activeAlerts.length > 1 ? "s" : ""}
                </span>
              )}
              <StatusBadge status={installation.status} />
            </div>
          </div>

          {/* Key metrics strip */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "0",
            marginTop: "22px", borderTop: "1px solid var(--solaris-border)", paddingTop: "20px"
          }}>
            {[
              { label: "Installed Capacity", value: installation.capacity_kw + " kWp" },
              { label: "Total Panels",       value: installation.panels_count.toLocaleString() },
              { label: "Current Power",      value: parseFloat(installation.current_power_kw).toFixed(1) + " kW" },
              { label: "Today's Yield",      value: parseFloat(installation.daily_yield_kwh).toLocaleString() + " kWh" },
              { label: "Efficiency",         value: parseFloat(installation.efficiency).toFixed(1) + "%" },
              { label: "Commissioned",       value: installation.commissioned_date }
            ].map((m, i) => (
              <div key={i} style={{
                padding: "0 20px",
                borderRight: i < 5 ? "1px solid var(--solaris-border)" : "none"
              }}>
                <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--solaris-text-muted)", marginBottom: "4px" }}>{m.label}</div>
                <div style={{ fontSize: "17px", fontWeight: 800, color: "var(--solaris-text-primary)" }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="solaris-tabs">
          {[
            { key: "overview",     label: "Overview",    icon: "fa fa-th-large" },
            { key: "panels",       label: `Panels (${panels.length})`, icon: "pe-7s-sun" },
            { key: "alerts",       label: `Alerts (${activeAlerts.length})`, icon: "fa fa-bell" },
            { key: "maintenance",  label: "Maintenance",  icon: "fa fa-wrench" },
            { key: "history",      label: "Energy History", icon: "pe-7s-signal" }
          ].map(tab => (
            <button
              key={tab.key}
              className={`solaris-tab${activeTab === tab.key ? " active" : ""}`}
              onClick={() => this.setState({ activeTab: tab.key })}
            >
              <i className={tab.icon} style={{ marginRight: "6px" }} />{tab.label}
            </button>
          ))}
        </div>

        {/* TAB: Overview */}
        {activeTab === "overview" && (
          <Grid fluid style={{ padding: 0 }}>
            <Row>
              <Col md={8}>
                <div className="solaris-chart-card">
                  <div className="solaris-chart-header">
                    <p className="solaris-card-title">Technical Specifications</p>
                  </div>
                  <div style={{ padding: "20px 24px" }}>
                    <div className="solaris-info-grid">
                      {[
                        { label: "Inverter Model",     value: installation.inverter_model },
                        { label: "Installed Capacity", value: installation.capacity_kw + " kWp" },
                        { label: "Panel Count",        value: installation.panels_count.toLocaleString() },
                        { label: "Current Output",     value: parseFloat(installation.current_power_kw).toFixed(1) + " kW" },
                        { label: "Daily Yield",        value: parseFloat(installation.daily_yield_kwh).toLocaleString() + " kWh" },
                        { label: "Portfolio Efficiency",value: parseFloat(installation.efficiency).toFixed(1) + "%" },
                        { label: "Location",           value: installation.location },
                        { label: "Region",             value: installation.region },
                        { label: "Commission Date",    value: installation.commissioned_date },
                        { label: "Status",             value: installation.status }
                      ].map((item, i) => (
                        <div key={i} className="solaris-info-item">
                          <span className="solaris-info-label">{item.label}</span>
                          <span className="solaris-info-value">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div className="solaris-chart-card">
                  <div className="solaris-chart-header">
                    <p className="solaris-card-title">Performance Summary</p>
                  </div>
                  <div style={{ padding: "20px 24px" }}>
                    {/* Efficiency gauge bar */}
                    <div style={{ marginBottom: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--solaris-text-secondary)" }}>Efficiency</span>
                        <span style={{ fontSize: "15px", fontWeight: 800, color: "var(--solaris-text-primary)" }}>{parseFloat(installation.efficiency).toFixed(1)}%</span>
                      </div>
                      <div style={{ height: "10px", background: "#e2e8f0", borderRadius: "5px", overflow: "hidden" }}>
                        <div style={{
                          height: "100%", width: `${installation.efficiency}%`, borderRadius: "5px",
                          background: installation.efficiency >= 91 ? "linear-gradient(90deg,#10b981,#34d399)"
                            : installation.efficiency >= 85 ? "linear-gradient(90deg,#f59e0b,#fbbf24)"
                            : "linear-gradient(90deg,#ef4444,#f87171)"
                        }} />
                      </div>
                    </div>
                    {/* Utilization */}
                    <div style={{ marginBottom: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--solaris-text-secondary)" }}>Capacity Utilization</span>
                        <span style={{ fontSize: "15px", fontWeight: 800, color: "var(--solaris-text-primary)" }}>
                          {((installation.current_power_kw / installation.capacity_kw) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div style={{ height: "10px", background: "#e2e8f0", borderRadius: "5px", overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: "5px",
                          width: `${(installation.current_power_kw / installation.capacity_kw) * 100}%`,
                          background: "linear-gradient(90deg, #0284c7, #38bdf8)"
                        }} />
                      </div>
                    </div>
                    {/* CO2 */}
                    <div style={{ background: "#ecfdf5", borderRadius: "8px", padding: "14px", border: "1px solid #a7f3d0" }}>
                      <div style={{ fontSize: "11.5px", fontWeight: 600, textTransform: "uppercase", color: "#065f46", marginBottom: "4px" }}>CO₂ Offset Today</div>
                      <div style={{ fontSize: "22px", fontWeight: 800, color: "#065f46" }}>
                        {(parseFloat(installation.daily_yield_kwh) * 0.7 / 1000).toFixed(2)}
                        <span style={{ fontSize: "13px", fontWeight: 500, marginLeft: "4px" }}>tonnes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Grid>
        )}

        {/* TAB: Panels */}
        {activeTab === "panels" && (
          <div className="solaris-chart-card">
            <div className="solaris-chart-header">
              <p className="solaris-card-title">Panel Assets — {installation.name}</p>
              <p className="solaris-card-subtitle">{panels.length} panels across all strings</p>
            </div>
            <div className="solaris-table-wrapper">
              <table className="solaris-table">
                <thead>
                  <tr>
                    <th>Panel Code</th>
                    <th>String</th>
                    <th>Model</th>
                    <th>Voltage</th>
                    <th>Current</th>
                    <th>Power</th>
                    <th>Temperature</th>
                    <th>Efficiency</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {panels.length === 0 ? (
                    <tr><td colSpan="9" style={{ textAlign: "center", padding: "32px", color: "var(--solaris-text-muted)" }}>No panels found</td></tr>
                  ) : panels.map(p => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 600, fontFamily: "monospace", fontSize: "13px" }}>{p.panel_code}</td>
                      <td style={{ color: "var(--solaris-text-muted)", fontSize: "13px" }}>{p.string_id}</td>
                      <td style={{ fontSize: "12.5px", color: "var(--solaris-text-secondary)" }}>{p.model}</td>
                      <td style={{ fontWeight: 600 }}>{p.voltage} <span style={{ color: "var(--solaris-text-muted)", fontWeight: 400, fontSize: "12px" }}>V</span></td>
                      <td style={{ fontWeight: 600 }}>{p.current} <span style={{ color: "var(--solaris-text-muted)", fontWeight: 400, fontSize: "12px" }}>A</span></td>
                      <td style={{ fontWeight: 600, color: "#f59e0b" }}>{p.power_w} <span style={{ color: "var(--solaris-text-muted)", fontWeight: 400, fontSize: "12px" }}>W</span></td>
                      <td style={{ color: p.temperature_c > 45 ? "#ef4444" : "var(--solaris-text-primary)", fontWeight: 600 }}>
                        {p.temperature_c} °C
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: p.efficiency >= 20 ? "#10b981" : p.efficiency >= 18 ? "#f59e0b" : "#ef4444" }}>
                          {p.efficiency}%
                        </span>
                      </td>
                      <td><StatusBadge status={p.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: Alerts */}
        {activeTab === "alerts" && (
          <div className="solaris-chart-card">
            <div className="solaris-chart-header">
              <p className="solaris-card-title">System Alerts</p>
              <span>{activeAlerts.length} active</span>
            </div>
            <div>
              {alerts.length === 0 ? (
                <div className="solaris-empty-state">
                  <i className="fa fa-check-circle" style={{ color: "#10b981" }} />
                  <p>No alerts for this installation</p>
                </div>
              ) : alerts.map(alert => {
                const sev = (alert.severity || "info").toLowerCase();
                const icon = sev === "critical" ? "fa-exclamation-circle" : sev === "warning" ? "fa-exclamation-triangle" : "fa-info-circle";
                const color = sev === "critical" ? "#dc2626" : sev === "warning" ? "#d97706" : "#0284c7";
                return (
                  <div key={alert.id} style={{
                    padding: "16px 24px", borderBottom: "1px solid var(--solaris-border)",
                    display: "flex", gap: "14px", alignItems: "flex-start",
                    background: alert.status === "acknowledged" ? "#f8fafc" : "white",
                    opacity: alert.status === "acknowledged" ? 0.7 : 1
                  }}>
                    <i className={`fa ${icon}`} style={{ color, fontSize: "18px", marginTop: "2px", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--solaris-text-primary)", marginBottom: "4px" }}>{alert.title}</div>
                      <div style={{ fontSize: "13px", color: "var(--solaris-text-secondary)", marginBottom: "8px" }}>{alert.message}</div>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                        <span className={`severity-${sev}`}>{alert.severity}</span>
                        <span style={{ fontSize: "12px", color: "var(--solaris-text-muted)" }}>
                          {new Date(alert.created_at).toLocaleString()}
                        </span>
                        {alert.status === "acknowledged" && (
                          <span className="solaris-badge badge-info">acknowledged</span>
                        )}
                      </div>
                    </div>
                    {alert.status === "active" && (
                      <button
                        className="solaris-btn-outline"
                        style={{ fontSize: "12px", padding: "5px 12px", flexShrink: 0 }}
                        disabled={acknowledging === alert.id}
                        onClick={() => this.acknowledgeAlert(alert.id)}
                      >
                        {acknowledging === alert.id ? <i className="fa fa-spinner fa-spin" /> : "Acknowledge"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: Maintenance */}
        {activeTab === "maintenance" && (
          <div className="solaris-chart-card">
            <div className="solaris-chart-header">
              <p className="solaris-card-title">Maintenance Log</p>
            </div>
            <div className="solaris-table-wrapper">
              <table className="solaris-table">
                <thead>
                  <tr><th>Task Type</th><th>Technician</th><th>Scheduled Date</th><th>Status</th><th>Notes</th></tr>
                </thead>
                <tbody>
                  {maintenance.length === 0 ? (
                    <tr><td colSpan="5" style={{ textAlign: "center", padding: "32px", color: "var(--solaris-text-muted)" }}>No maintenance records</td></tr>
                  ) : maintenance.map(m => (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 600 }}>{m.task_type}</td>
                      <td>{m.technician}</td>
                      <td>{m.scheduled_date}</td>
                      <td><StatusBadge status={m.status} /></td>
                      <td style={{ fontSize: "12.5px", color: "var(--solaris-text-muted)", maxWidth: "300px" }}>{m.notes || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: Energy History */}
        {activeTab === "history" && (
          <div>
            <div style={{
              display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px",
              background: "white", border: "1px solid var(--solaris-border)",
              borderRadius: "10px", padding: "14px 20px", boxShadow: "var(--solaris-shadow-sm)"
            }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--solaris-text-muted)" }}>Time Window:</span>
              <div className="solaris-btn-group">
                {TIME_PERIODS.map(p => (
                  <button key={p.value}
                    className={`solaris-btn-tab${timePeriod === p.value ? " active" : ""}`}
                    onClick={() => this.setState({ timePeriod: p.value })}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <Grid fluid style={{ padding: 0 }}>
              <Row>
                <Col md={6}>
                  <div className="solaris-chart-card">
                    <div className="solaris-chart-header">
                      <p className="solaris-card-title">Solar Cell Chart</p>
                      <p className="solaris-card-subtitle">Voltage &amp; Current</p>
                    </div>
                    <div className="solaris-chart-body">
                      <DataBaseCard title="Solar Cell Chart" isMixed="1" externalPeriod={timePeriod} plain />
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="solaris-chart-card">
                    <div className="solaris-chart-header">
                      <p className="solaris-card-title">Battery Chart</p>
                      <p className="solaris-card-subtitle">Voltage &amp; Current</p>
                    </div>
                    <div className="solaris-chart-body">
                      <DataBaseCard title="Battery Chart" isMixed="1" externalPeriod={timePeriod} plain />
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <div className="solaris-chart-card">
                    <div className="solaris-chart-header">
                      <p className="solaris-card-title">Panel Surface Temperature</p>
                    </div>
                    <div className="solaris-chart-body">
                      <DataBaseCard title="Solar cell Suface temperature" externalPeriod={timePeriod} plain />
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="solaris-chart-card">
                    <div className="solaris-chart-header">
                      <p className="solaris-card-title">Charge Speed &amp; Temperature</p>
                    </div>
                    <div className="solaris-chart-body">
                      <DataBaseCard title="Charge Speed" isMixed="1" externalPeriod={timePeriod} plain />
                    </div>
                  </div>
                </Col>
              </Row>
            </Grid>
          </div>
        )}
      </div>
    );
  }
}

export default InstallationDetail;
