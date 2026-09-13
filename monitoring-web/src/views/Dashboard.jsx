import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";

// Existing working chart components — preserved as-is
import Surface_temp_chart from "components/Chart/Surface_temp_chart";
import Controller_output from "components/Controller_output.js";
import SurfaceAndChargeSpeedChart from "components/Chart/SurfaceAndChargeSpeedChart";
import Solar_cell_voltage_chart from "components/Chart/Solar_cell_voltage_chart";
import Battery_voltage_chart from "components/Chart/Battery_voltage_chart";

const API = "http://localhost:3001";

function KpiCard({ label, value, unit, icon, colorClass, barClass, trend, trendLabel }) {
  return (
    <div className="solaris-kpi-card">
      <div className="solaris-kpi-top">
        <span className="solaris-kpi-label">{label}</span>
        <div className={`solaris-kpi-icon-box ${colorClass}`}>
          <i className={icon} />
        </div>
      </div>
      <div>
        <span className="solaris-kpi-value">{value}</span>
        {unit && <span className="solaris-kpi-unit">{unit}</span>}
      </div>
      <div className="solaris-kpi-bottom">
        {trend && (
          <span className="solaris-kpi-trend-up">
            <i className="fa fa-arrow-up" style={{ fontSize: "10px" }} /> {trend}
          </span>
        )}
        <span>{trendLabel}</span>
      </div>
      <div className={`solaris-kpi-bar ${barClass}`} />
    </div>
  );
}

function StatusBadge({ status }) {
  const s = (status || "").toLowerCase();
  const map = {
    operational: "badge-operational",
    warning: "badge-warning",
    maintenance: "badge-maintenance",
    critical: "badge-critical"
  };
  return (
    <span className={`solaris-badge ${map[s] || "badge-info"}`}>
      <span style={{
        width: "6px", height: "6px", borderRadius: "50%", display: "inline-block",
        background: s === "operational" ? "#10b981" : s === "warning" ? "#f59e0b" : s === "maintenance" ? "#3b82f6" : "#ef4444"
      }} />
      {status}
    </span>
  );
}

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stats: null,
      installations: [],
      recentAlerts: [],
      lastReading: null,
      loading: true,
      statsError: false
    };
  }

  componentDidMount() {
    this.loadData();
    // Refresh stats every 30 seconds
    this.refreshInterval = setInterval(() => this.loadData(), 30000);
  }

  componentWillUnmount() {
    if (this.refreshInterval) clearInterval(this.refreshInterval);
  }

  loadData() {
    Promise.all([
      axios.get(`${API}/api/system_stats`).catch(() => null),
      axios.get(`${API}/api/installations`).catch(() => ({ data: [] })),
      axios.get(`${API}/api/alerts`).catch(() => ({ data: [] })),
      axios.get(`${API}/controller_info_last`).catch(() => null)
    ]).then(([statsRes, instRes, alertsRes, liveRes]) => {
      this.setState({
        stats: statsRes ? statsRes.data : null,
        statsError: !statsRes,
        installations: (instRes.data || []).slice(0, 5),
        recentAlerts: (alertsRes.data || [])
          .filter(a => a.status === "active")
          .slice(0, 4),
        lastReading: liveRes ? (liveRes.data || [])[0] : null,
        loading: false
      });
    });
  }

  formatNum(val, decimals = 1) {
    if (val === null || val === undefined) return "—";
    const n = parseFloat(val);
    return isNaN(n) ? "—" : n.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  formatInt(val) {
    if (val === null || val === undefined) return "—";
    return parseInt(val, 10).toLocaleString();
  }

  render() {
    const { stats, installations, recentAlerts, lastReading, loading } = this.state;

    // KPI derived values
    const totalInstallations = stats ? this.formatInt(stats.total_installations) : "—";
    const totalPanels        = stats ? this.formatInt(stats.total_panels) : "—";
    const dailyYield         = stats ? this.formatInt(stats.total_daily_yield_kwh) : "—";
    const avgEfficiency      = stats ? this.formatNum(stats.avg_efficiency) : "—";
    const totalCapacity      = stats ? this.formatNum(stats.total_capacity_kw, 0) : "—";
    const co2Offset          = stats ? stats.co2_offset_tonnes : "—";
    const activeAlerts       = stats ? parseInt(stats.active_alerts, 10) : 0;
    const upcomingMaint      = stats ? parseInt(stats.upcoming_maintenance, 10) : 0;

    return (
      <div className="content">
        {/* Page header */}
        <div className="solaris-page-header">
          <div>
            <h2 className="solaris-section-title">Portfolio Overview</h2>
            <p className="solaris-section-subtitle">
              Real-time monitoring across all solar installations · Simulation data
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {activeAlerts > 0 && (
              <Link to="/admin/alerts" style={{ textDecoration: "none" }}>
                <span className="severity-critical">
                  <i className="fa fa-exclamation-triangle" />
                  {activeAlerts} Active Alert{activeAlerts > 1 ? "s" : ""}
                </span>
              </Link>
            )}
            {upcomingMaint > 0 && (
              <Link to="/admin/maintenance" style={{ textDecoration: "none" }}>
                <span className="severity-info">
                  <i className="fa fa-wrench" />
                  {upcomingMaint} Scheduled
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* KPI Cards Row */}
        <div className="solaris-kpi-grid">
          <KpiCard
            label="Total Installations"
            value={totalInstallations}
            icon="pe-7s-map-marker"
            colorClass="solaris-kpi-icon-sky"
            barClass="solaris-kpi-bar-sky"
            trend="+1"
            trendLabel="this quarter"
          />
          <KpiCard
            label="Active Solar Panels"
            value={totalPanels}
            icon="pe-7s-sun"
            colorClass="solaris-kpi-icon-gold"
            barClass="solaris-kpi-bar-gold"
            trendLabel={`${totalCapacity} kWp installed`}
          />
          <KpiCard
            label="Energy Produced Today"
            value={dailyYield}
            unit="kWh"
            icon="pe-7s-lightning"
            colorClass="solaris-kpi-icon-emerald"
            barClass="solaris-kpi-bar-emerald"
            trend="↑ Peak"
            trendLabel="production"
          />
          <KpiCard
            label="Average Efficiency"
            value={avgEfficiency}
            unit="%"
            icon="pe-7s-signal"
            colorClass="solaris-kpi-icon-slate"
            barClass="solaris-kpi-bar-orange"
            trendLabel="portfolio average"
          />
        </div>

        {/* Secondary KPI row */}
        <Grid fluid style={{ padding: 0 }}>
          <Row>
            {/* CO₂ offset card */}
            <Col md={3} sm={6}>
              <div className="solaris-kpi-card" style={{ background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)", border: "1px solid #a7f3d0" }}>
                <div className="solaris-kpi-top">
                  <span className="solaris-kpi-label" style={{ color: "#065f46" }}>CO₂ Offset Today</span>
                  <div className="solaris-kpi-icon-box" style={{ background: "#10b981", color: "white" }}>
                    <i className="fa fa-leaf" />
                  </div>
                </div>
                <div>
                  <span className="solaris-kpi-value" style={{ color: "#065f46" }}>{co2Offset}</span>
                  <span className="solaris-kpi-unit" style={{ color: "#059669" }}> tonnes</span>
                </div>
                <div className="solaris-kpi-bottom" style={{ color: "#059669" }}>
                  <span>≈ {stats ? stats.trees_equivalent : "—"} trees absorbed</span>
                </div>
              </div>
            </Col>

            {/* Live sensor reading */}
            <Col md={3} sm={6}>
              <div className="solaris-kpi-card">
                <div className="solaris-kpi-top">
                  <span className="solaris-kpi-label">Live Solar Voltage</span>
                  <div className="solaris-kpi-icon-box solaris-kpi-icon-gold">
                    <i className="fa fa-bolt" />
                  </div>
                </div>
                <div>
                  <span className="solaris-kpi-value">
                    {lastReading ? parseFloat(lastReading.solar_voltage).toFixed(2) : "—"}
                  </span>
                  <span className="solaris-kpi-unit">V</span>
                </div>
                <div className="solaris-kpi-bottom">
                  <span>Solar Current: {lastReading ? parseFloat(lastReading.solar_current).toFixed(2) : "—"} A</span>
                </div>
                <div className="solaris-kpi-bar solaris-kpi-bar-gold" />
              </div>
            </Col>

            {/* Battery */}
            <Col md={3} sm={6}>
              <div className="solaris-kpi-card">
                <div className="solaris-kpi-top">
                  <span className="solaris-kpi-label">Battery Voltage</span>
                  <div className="solaris-kpi-icon-box solaris-kpi-icon-sky">
                    <i className="fa fa-battery-three-quarters" />
                  </div>
                </div>
                <div>
                  <span className="solaris-kpi-value">
                    {lastReading ? parseFloat(lastReading.battery_voltage).toFixed(2) : "—"}
                  </span>
                  <span className="solaris-kpi-unit">V</span>
                </div>
                <div className="solaris-kpi-bottom">
                  <span>State: {lastReading ? lastReading.battery_state : "—"}</span>
                </div>
                <div className="solaris-kpi-bar solaris-kpi-bar-sky" />
              </div>
            </Col>

            {/* Alerts summary */}
            <Col md={3} sm={6}>
              <div className="solaris-kpi-card" style={activeAlerts > 0 ? { borderColor: "#fecaca" } : {}}>
                <div className="solaris-kpi-top">
                  <span className="solaris-kpi-label">System Alerts</span>
                  <div className="solaris-kpi-icon-box" style={activeAlerts > 0 ? { background: "#fee2e2", color: "#dc2626" } : { background: "#d1fae5", color: "#059669" }}>
                    <i className={`fa fa-${activeAlerts > 0 ? "exclamation-triangle" : "check-circle"}`} />
                  </div>
                </div>
                <div>
                  <span className="solaris-kpi-value" style={activeAlerts > 0 ? { color: "#dc2626" } : { color: "#059669" }}>
                    {activeAlerts > 0 ? activeAlerts : "OK"}
                  </span>
                  {activeAlerts > 0 && <span className="solaris-kpi-unit">active</span>}
                </div>
                <div className="solaris-kpi-bottom">
                  <Link to="/admin/alerts" style={{ color: "#0284c7", fontSize: "12px", fontWeight: 600, textDecoration: "none" }}>
                    View all alerts →
                  </Link>
                </div>
                <div className="solaris-kpi-bar" style={{ background: activeAlerts > 0 ? "linear-gradient(90deg, #ef4444, #f87171)" : "linear-gradient(90deg, #10b981, #34d399)" }} />
              </div>
            </Col>
          </Row>
        </Grid>

        {/* Real-time charts section */}
        <div style={{ marginTop: "12px", marginBottom: "8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--solaris-text-primary)", margin: "0 0 2px 0" }}>
              Live Telemetry
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--solaris-text-muted)", margin: 0 }}>
              Real-time sensor data · Updates every 10 seconds
            </p>
          </div>
          <Link to="/admin/energy" className="solaris-btn-outline" style={{ textDecoration: "none", fontSize: "12px" }}>
            <i className="pe-7s-lightning" /> Full Monitoring
          </Link>
        </div>

        <Grid fluid style={{ padding: 0 }}>
          <Row>
            <Col md={4}>
              <div className="solaris-chart-card">
                <div className="solaris-chart-header">
                  <div>
                    <p className="solaris-card-title" style={{ fontSize: "14px" }}>Panel Surface Temperature</p>
                    <p className="solaris-card-subtitle">°C · Real-time</p>
                  </div>
                  <span className="solaris-status-pill" style={{ fontSize: "11px", padding: "4px 10px" }}>
                    <span className="solaris-pulse-dot" />
                    Live
                  </span>
                </div>
                <div className="solaris-chart-body" style={{ padding: "16px" }}>
                  <Surface_temp_chart />
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className="solaris-chart-card">
                <div className="solaris-chart-header">
                  <div>
                    <p className="solaris-card-title" style={{ fontSize: "14px" }}>Controller Output</p>
                    <p className="solaris-card-subtitle">Power gauge &amp; readings</p>
                  </div>
                  <span className="solaris-status-pill" style={{ fontSize: "11px", padding: "4px 10px" }}>
                    <span className="solaris-pulse-dot" />
                    Live
                  </span>
                </div>
                <div className="solaris-chart-body" style={{ padding: "16px" }}>
                  <Controller_output />
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className="solaris-chart-card">
                <div className="solaris-chart-header">
                  <div>
                    <p className="solaris-card-title" style={{ fontSize: "14px" }}>Charge Speed &amp; Temp</p>
                    <p className="solaris-card-subtitle">kWh yield vs. surface temp</p>
                  </div>
                  <span className="solaris-status-pill" style={{ fontSize: "11px", padding: "4px 10px" }}>
                    <span className="solaris-pulse-dot" />
                    Live
                  </span>
                </div>
                <div className="solaris-chart-body" style={{ padding: "16px" }}>
                  <SurfaceAndChargeSpeedChart />
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <div className="solaris-chart-card">
                <div className="solaris-chart-header">
                  <div>
                    <p className="solaris-card-title" style={{ fontSize: "14px" }}>Solar Cell Voltage</p>
                    <p className="solaris-card-subtitle">Volts · Real-time trend</p>
                  </div>
                  <Link to="/admin/analytics" className="solaris-btn-outline" style={{ textDecoration: "none", fontSize: "11px", padding: "5px 12px" }}>
                    Historical →
                  </Link>
                </div>
                <div className="solaris-chart-body" style={{ padding: "16px" }}>
                  <Solar_cell_voltage_chart />
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="solaris-chart-card">
                <div className="solaris-chart-header">
                  <div>
                    <p className="solaris-card-title" style={{ fontSize: "14px" }}>Battery Voltage</p>
                    <p className="solaris-card-subtitle">Volts · Real-time trend</p>
                  </div>
                  <Link to="/admin/analytics" className="solaris-btn-outline" style={{ textDecoration: "none", fontSize: "11px", padding: "5px 12px" }}>
                    Historical →
                  </Link>
                </div>
                <div className="solaris-chart-body" style={{ padding: "16px" }}>
                  <Battery_voltage_chart />
                </div>
              </div>
            </Col>
          </Row>
        </Grid>

        {/* Installations summary + recent alerts side-by-side */}
        <Grid fluid style={{ padding: 0, marginTop: "8px" }}>
          <Row>
            {/* Installations table */}
            <Col md={8}>
              <div className="solaris-chart-card">
                <div className="solaris-chart-header">
                  <div>
                    <p className="solaris-card-title">Installation Portfolio</p>
                    <p className="solaris-card-subtitle">Current production by site</p>
                  </div>
                  <Link to="/admin/installations" className="solaris-btn-outline" style={{ textDecoration: "none", fontSize: "12px" }}>
                    View all →
                  </Link>
                </div>
                <div className="solaris-table-wrapper">
                  <table className="solaris-table" style={{ marginBottom: 0 }}>
                    <thead>
                      <tr>
                        <th>Installation</th>
                        <th>Location</th>
                        <th>Capacity</th>
                        <th>Today's Yield</th>
                        <th>Efficiency</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: "center", padding: "32px", color: "var(--solaris-text-muted)" }}>
                            <i className="fa fa-spinner fa-spin" style={{ marginRight: "8px" }} />
                            Loading installations…
                          </td>
                        </tr>
                      ) : installations.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: "center", padding: "32px", color: "var(--solaris-text-muted)" }}>
                            No installations found
                          </td>
                        </tr>
                      ) : installations.map(inst => (
                        <tr key={inst.id} className="solaris-table-row-clickable"
                          onClick={() => this.props.history.push(`/admin/installations/${inst.id}`)}>
                          <td>
                            <div style={{ fontWeight: 600, color: "var(--solaris-text-primary)", fontSize: "13.5px" }}>
                              {inst.name.length > 28 ? inst.name.slice(0, 28) + "…" : inst.name}
                            </div>
                            <div style={{ fontSize: "11.5px", color: "var(--solaris-text-muted)" }}>{inst.code}</div>
                          </td>
                          <td style={{ color: "var(--solaris-text-secondary)", fontSize: "13px" }}>{inst.region}</td>
                          <td style={{ fontWeight: 600 }}>{inst.capacity_kw} <span style={{ color: "var(--solaris-text-muted)", fontWeight: 400, fontSize: "12px" }}>kWp</span></td>
                          <td style={{ fontWeight: 600 }}>
                            {parseFloat(inst.daily_yield_kwh).toLocaleString()} <span style={{ color: "var(--solaris-text-muted)", fontWeight: 400, fontSize: "12px" }}>kWh</span>
                          </td>
                          <td>
                            <div className="solaris-efficiency-bar">
                              <div className="solaris-efficiency-track">
                                <div
                                  className={`solaris-efficiency-fill ${inst.efficiency < 85 ? "low" : inst.efficiency < 91 ? "medium" : ""}`}
                                  style={{ width: `${inst.efficiency}%` }}
                                />
                              </div>
                              <span style={{ fontSize: "12.5px", fontWeight: 600, minWidth: "40px", color: "var(--solaris-text-primary)" }}>
                                {parseFloat(inst.efficiency).toFixed(1)}%
                              </span>
                            </div>
                          </td>
                          <td><StatusBadge status={inst.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Col>

            {/* Recent alerts column */}
            <Col md={4}>
              <div className="solaris-chart-card" style={{ height: "100%" }}>
                <div className="solaris-chart-header">
                  <div>
                    <p className="solaris-card-title">Active Alerts</p>
                    <p className="solaris-card-subtitle">Requires attention</p>
                  </div>
                  <Link to="/admin/alerts" className="solaris-btn-outline" style={{ textDecoration: "none", fontSize: "12px" }}>
                    All →
                  </Link>
                </div>
                <div style={{ padding: "8px 0" }}>
                  {recentAlerts.length === 0 ? (
                    <div className="solaris-empty-state">
                      <i className="fa fa-check-circle" style={{ color: "#10b981" }} />
                      <p>All systems operational</p>
                    </div>
                  ) : recentAlerts.map(alert => {
                    const sev = (alert.severity || "info").toLowerCase();
                    const icon = sev === "critical" ? "fa-exclamation-circle" : sev === "warning" ? "fa-exclamation-triangle" : "fa-info-circle";
                    const color = sev === "critical" ? "#dc2626" : sev === "warning" ? "#d97706" : "#0284c7";
                    return (
                      <div key={alert.id} style={{
                        padding: "14px 20px",
                        borderBottom: "1px solid var(--solaris-border)",
                        display: "flex",
                        gap: "12px",
                        alignItems: "flex-start"
                      }}>
                        <i className={`fa ${icon}`} style={{ color, marginTop: "2px", fontSize: "15px", flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: "13px", color: "var(--solaris-text-primary)", marginBottom: "3px" }}>
                            {alert.title}
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--solaris-text-muted)", marginBottom: "4px" }}>
                            {alert.installation_name}
                          </div>
                          <span className={`severity-${sev}`} style={{ fontSize: "10.5px", padding: "2px 8px" }}>
                            {alert.severity}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Dashboard;
