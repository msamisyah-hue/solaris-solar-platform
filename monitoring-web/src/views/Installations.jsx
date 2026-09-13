import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = "http://localhost:3001";

function StatusBadge({ status }) {
  const s = (status || "").toLowerCase();
  const map = {
    operational: "badge-operational",
    warning: "badge-warning",
    maintenance: "badge-maintenance",
    critical: "badge-critical"
  };
  const dot = { operational: "#10b981", warning: "#f59e0b", maintenance: "#3b82f6", critical: "#ef4444" };
  return (
    <span className={`solaris-badge ${map[s] || "badge-info"}`}>
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", display: "inline-block", background: dot[s] || "#94a3b8" }} />
      {status}
    </span>
  );
}

class Installations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      installations: [],
      loading: true,
      search: ""
    };
  }

  componentDidMount() {
    axios.get(`${API}/api/installations`)
      .then(res => this.setState({ installations: res.data || [], loading: false }))
      .catch(() => this.setState({ loading: false }));
  }

  render() {
    const { installations, loading, search } = this.state;
    const filtered = installations.filter(i =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.location.toLowerCase().includes(search.toLowerCase()) ||
      i.region.toLowerCase().includes(search.toLowerCase())
    );

    const totalCapacity = installations.reduce((s, i) => s + parseFloat(i.capacity_kw || 0), 0);
    const totalYield    = installations.reduce((s, i) => s + parseFloat(i.daily_yield_kwh || 0), 0);
    const operational   = installations.filter(i => i.status === "Operational").length;

    return (
      <div className="content">
        <div className="solaris-page-header">
          <div>
            <h2 className="solaris-section-title">Installations</h2>
            <p className="solaris-section-subtitle">
              Solar asset portfolio · {installations.length} sites · {totalCapacity.toFixed(0)} kWp total capacity
            </p>
          </div>
        </div>

        {/* Summary strip */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px",
          marginBottom: "24px"
        }}>
          {[
            { label: "Total Sites",       value: installations.length,               icon: "pe-7s-map-marker", color: "#0284c7", bg: "#e0f2fe" },
            { label: "Operational",       value: operational,                        icon: "fa fa-check-circle", color: "#10b981", bg: "#d1fae5" },
            { label: "Total Capacity",    value: totalCapacity.toFixed(0) + " kWp",  icon: "pe-7s-lightning",  color: "#f59e0b", bg: "#fef3c7" },
            { label: "Total Yield Today", value: totalYield.toLocaleString() + " kWh", icon: "pe-7s-signal",  color: "#8b5cf6", bg: "#ede9fe" }
          ].map((s, i) => (
            <div key={i} style={{
              background: "white", border: "1px solid var(--solaris-border)",
              borderRadius: "10px", padding: "16px 20px",
              display: "flex", alignItems: "center", gap: "14px",
              boxShadow: "var(--solaris-shadow-sm)"
            }}>
              <div style={{
                width: "42px", height: "42px", borderRadius: "10px",
                background: s.bg, color: s.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "20px", flexShrink: 0
              }}>
                <i className={s.icon} />
              </div>
              <div>
                <div style={{ fontSize: "11.5px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--solaris-text-muted)" }}>{s.label}</div>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--solaris-text-primary)", lineHeight: 1.2 }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="solaris-chart-card">
          <div className="solaris-chart-header">
            <div>
              <p className="solaris-card-title">Installation Portfolio</p>
              <p className="solaris-card-subtitle">Click a row to view full details</p>
            </div>
            <div className="solaris-search-wrapper">
              <i className="fa fa-search solaris-search-icon" />
              <input
                className="solaris-search-input"
                placeholder="Search by name, location…"
                value={search}
                onChange={e => this.setState({ search: e.target.value })}
              />
            </div>
          </div>

          <div className="solaris-table-wrapper">
            <table className="solaris-table">
              <thead>
                <tr>
                  <th>Installation</th>
                  <th>Location / Region</th>
                  <th>Capacity</th>
                  <th>Panels</th>
                  <th>Current Power</th>
                  <th>Today's Yield</th>
                  <th>Efficiency</th>
                  <th>Commissioned</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="9" style={{ textAlign: "center", padding: "40px", color: "var(--solaris-text-muted)" }}>
                    <i className="fa fa-spinner fa-spin" style={{ marginRight: "8px" }} />Loading…
                  </td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="9" style={{ textAlign: "center", padding: "40px", color: "var(--solaris-text-muted)" }}>
                    No installations found
                  </td></tr>
                ) : filtered.map(inst => (
                  <tr key={inst.id}
                    className="solaris-table-row-clickable"
                    onClick={() => this.props.history.push(`/admin/installations/${inst.id}`)}>
                    <td>
                      <div style={{ fontWeight: 600, color: "var(--solaris-text-primary)" }}>{inst.name}</div>
                      <div style={{ fontSize: "11.5px", color: "var(--solaris-text-muted)", fontFamily: "monospace" }}>{inst.code}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: "13px", color: "var(--solaris-text-secondary)" }}>{inst.location}</div>
                      <div style={{ fontSize: "11.5px", color: "var(--solaris-text-muted)" }}>{inst.region}</div>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {inst.capacity_kw} <span style={{ color: "var(--solaris-text-muted)", fontWeight: 400, fontSize: "12px" }}>kWp</span>
                    </td>
                    <td style={{ textAlign: "center", fontWeight: 600 }}>
                      {inst.panels_count.toLocaleString()}
                    </td>
                    <td style={{ fontWeight: 600, color: "#10b981" }}>
                      {parseFloat(inst.current_power_kw).toFixed(1)} <span style={{ color: "var(--solaris-text-muted)", fontWeight: 400, fontSize: "12px" }}>kW</span>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {parseFloat(inst.daily_yield_kwh).toLocaleString()} <span style={{ color: "var(--solaris-text-muted)", fontWeight: 400, fontSize: "12px" }}>kWh</span>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ flex: 1, height: "6px", background: "#e2e8f0", borderRadius: "3px", overflow: "hidden", minWidth: "60px" }}>
                          <div style={{
                            height: "100%", borderRadius: "3px",
                            width: `${inst.efficiency}%`,
                            background: inst.efficiency >= 91 ? "linear-gradient(90deg,#10b981,#34d399)"
                              : inst.efficiency >= 85 ? "linear-gradient(90deg,#f59e0b,#fbbf24)"
                              : "linear-gradient(90deg,#ef4444,#f87171)"
                          }} />
                        </div>
                        <span style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--solaris-text-primary)", minWidth: "38px" }}>
                          {parseFloat(inst.efficiency).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td style={{ fontSize: "13px", color: "var(--solaris-text-secondary)" }}>
                      {inst.commissioned_date}
                    </td>
                    <td><StatusBadge status={inst.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cards grid view */}
        <div style={{ marginTop: "8px", marginBottom: "8px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--solaris-text-muted)", margin: "16px 0" }}>
            Site Cards
          </h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {filtered.map(inst => {
            return (
              <div key={inst.id}
                className="solaris-kpi-card"
                style={{ cursor: "pointer" }}
                onClick={() => this.props.history.push(`/admin/installations/${inst.id}`)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                  <div style={{
                    width: "42px", height: "42px", borderRadius: "10px",
                    background: "linear-gradient(135deg, #f59e0b22, #f59e0b44)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "20px", color: "#f59e0b"
                  }}>
                    <i className="pe-7s-sun" />
                  </div>
                  <StatusBadge status={inst.status} />
                </div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--solaris-text-primary)", marginBottom: "2px" }}>
                  {inst.name.length > 30 ? inst.name.slice(0, 30) + "…" : inst.name}
                </div>
                <div style={{ fontSize: "12px", color: "var(--solaris-text-muted)", marginBottom: "14px" }}>
                  <i className="fa fa-map-marker" style={{ marginRight: "4px" }} />{inst.location}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {[
                    { label: "Capacity", value: inst.capacity_kw + " kWp" },
                    { label: "Panels",   value: inst.panels_count.toLocaleString() },
                    { label: "Yield Today", value: parseFloat(inst.daily_yield_kwh).toLocaleString() + " kWh" },
                    { label: "Efficiency",  value: parseFloat(inst.efficiency).toFixed(1) + "%" }
                  ].map((m, i) => (
                    <div key={i} style={{ background: "#f8fafc", borderRadius: "6px", padding: "8px 10px" }}>
                      <div style={{ fontSize: "11px", color: "var(--solaris-text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px" }}>{m.label}</div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--solaris-text-primary)" }}>{m.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Installations;
