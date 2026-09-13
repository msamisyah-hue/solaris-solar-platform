import React, { Component } from "react";
import axios from "axios";

const API = "http://localhost:3001";

function StatusBadge({ status }) {
  const s = (status || "").toLowerCase();
  const map = { optimal: "badge-operational", "sub-optimal": "badge-warning", degraded: "badge-critical" };
  const dot = { optimal: "#38A169", "sub-optimal": "#F4B942", degraded: "#ef4444" };
  const labels = { optimal: "Optimal", "sub-optimal": "Sous-optimal", degraded: "Dégradé" };
  return (
    <span className={`solaris-badge ${map[s] || "badge-info"}`}>
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", display: "inline-block", background: dot[s] || "#94a3b8" }} />
      {labels[s] || status}
    </span>
  );
}

class SolarPanels extends Component {
  constructor(props) {
    super(props);
    this.state = { panels: [], loading: true, search: "", filterStatus: "Tous" };
  }

  componentDidMount() {
    axios.get(`${API}/api/panels`)
      .then(res => this.setState({ panels: res.data || [], loading: false }))
      .catch(() => this.setState({ loading: false }));
  }

  render() {
    const { panels, loading, search, filterStatus } = this.state;
    const statuses = ["Tous", "Optimal", "Sub-optimal", "Degraded"];
    const statusMap = { "Tous": "All", "Optimal": "Optimal", "Sub-optimal": "Sub-optimal", "Degraded": "Degraded" };

    const filtered = panels.filter(p => {
      const matchSearch = !search || p.panel_code.toLowerCase().includes(search.toLowerCase()) || (p.installation_name || "").toLowerCase().includes(search.toLowerCase()) || p.model.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "Tous" || p.status === statusMap[filterStatus];
      return matchSearch && matchStatus;
    });

    const optimal    = panels.filter(p => p.status === "Optimal").length;
    const suboptimal = panels.filter(p => p.status === "Sub-optimal").length;
    const degraded   = panels.filter(p => p.status === "Degraded").length;
    const avgEff     = panels.length > 0 ? (panels.reduce((s, p) => s + parseFloat(p.efficiency || 0), 0) / panels.length).toFixed(1) : "—";
    const avgTemp    = panels.length > 0 ? (panels.reduce((s, p) => s + parseFloat(p.temperature_c || 0), 0) / panels.length).toFixed(1) : "—";

    return (
      <div className="content">
        <div className="solaris-page-header">
          <div>
            <h2 className="solaris-section-title">Panneaux Solaires</h2>
            <p className="solaris-section-subtitle">{panels.length} panneaux sur toutes les installations · Rendement moy. {avgEff}%</p>
          </div>
        </div>

        {/* Récapitulatif */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Total Panneaux",    value: panels.length,  icon: "pe-7s-sun",           color: "#F4B942", bg: "#fef9c3" },
            { label: "Optimal",           value: optimal,         icon: "fa fa-check-circle",  color: "#38A169", bg: "#dcfce7" },
            { label: "Sous-optimal",      value: suboptimal,      icon: "fa fa-minus-circle",  color: "#F4B942", bg: "#fffbeb" },
            { label: "Dégradé",           value: degraded,        icon: "fa fa-times-circle",  color: "#ef4444", bg: "#fee2e2" },
            { label: "Rendement Moy.",    value: avgEff + "%",    icon: "pe-7s-signal",        color: "#176B5B", bg: "#dcfce7" }
          ].map((s, i) => (
            <div key={i} style={{ background: "white", border: "1px solid var(--solaris-border)", borderRadius: "10px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px", boxShadow: "var(--solaris-shadow-sm)" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: s.bg, color: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
                <i className={s.icon} />
              </div>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--solaris-text-muted)" }}>{s.label}</div>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--solaris-text-primary)", lineHeight: 1.2 }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tableau */}
        <div className="solaris-chart-card">
          <div className="solaris-chart-header">
            <div>
              <p className="solaris-card-title">Registre des Actifs Panneaux</p>
              <p className="solaris-card-subtitle">Température moy. {avgTemp} °C sur tous les panneaux</p>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              <div className="solaris-btn-group">
                {statuses.map(s => (
                  <button key={s} className={`solaris-btn-tab${filterStatus === s ? " active" : ""}`} onClick={() => this.setState({ filterStatus: s })}>{s}</button>
                ))}
              </div>
              <div className="solaris-search-wrapper">
                <i className="fa fa-search solaris-search-icon" />
                <input className="solaris-search-input" placeholder="Rechercher panneau, modèle…" value={search} onChange={e => this.setState({ search: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="solaris-table-wrapper">
            <table className="solaris-table">
              <thead>
                <tr>
                  <th>Code Panneau</th><th>Installation</th><th>Chaîne</th><th>Modèle</th>
                  <th>Tension</th><th>Courant</th><th>Puissance</th><th>Température</th><th>Rendement</th><th>État</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="10" style={{ textAlign: "center", padding: "40px", color: "var(--solaris-text-muted)" }}>
                    <i className="fa fa-spinner fa-spin" style={{ marginRight: "8px" }} />Chargement des panneaux…
                  </td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="10" style={{ textAlign: "center", padding: "40px", color: "var(--solaris-text-muted)" }}>Aucun panneau ne correspond au filtre</td></tr>
                ) : filtered.map(p => (
                  <tr key={p.id}>
                    <td><span style={{ fontFamily: "monospace", fontSize: "12.5px", fontWeight: 700, background: "#f1f5f9", padding: "3px 7px", borderRadius: "4px" }}>{p.panel_code}</span></td>
                    <td>
                      <div style={{ fontSize: "13px", fontWeight: 600 }}>{(p.installation_name || "—").length > 22 ? (p.installation_name || "").slice(0, 22) + "…" : (p.installation_name || "—")}</div>
                      <div style={{ fontSize: "11.5px", color: "var(--solaris-text-muted)" }}>{p.installation_location}</div>
                    </td>
                    <td style={{ color: "var(--solaris-text-muted)", fontSize: "12.5px", fontFamily: "monospace" }}>{p.string_id}</td>
                    <td style={{ fontSize: "12.5px", color: "var(--solaris-text-secondary)" }}>{p.model}</td>
                    <td style={{ fontWeight: 600 }}>{p.voltage} <span style={{ color: "var(--solaris-text-muted)", fontWeight: 400, fontSize: "11.5px" }}>V</span></td>
                    <td style={{ fontWeight: 600 }}>{p.current} <span style={{ color: "var(--solaris-text-muted)", fontWeight: 400, fontSize: "11.5px" }}>A</span></td>
                    <td style={{ fontWeight: 700, color: "#F4B942" }}>{p.power_w} <span style={{ color: "var(--solaris-text-muted)", fontWeight: 400, fontSize: "11.5px" }}>W</span></td>
                    <td><span style={{ fontWeight: 600, color: p.temperature_c > 45 ? "#ef4444" : p.temperature_c > 38 ? "#F4B942" : "var(--solaris-text-primary)" }}>{p.temperature_c} °C</span></td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <div style={{ width: "50px", height: "5px", background: "#e2e8f0", borderRadius: "2px", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${(p.efficiency / 25) * 100}%`, background: p.efficiency >= 20 ? "#38A169" : p.efficiency >= 18 ? "#F4B942" : "#ef4444", borderRadius: "2px" }} />
                        </div>
                        <span style={{ fontSize: "12.5px", fontWeight: 700, color: p.efficiency >= 20 ? "#38A169" : p.efficiency >= 18 ? "#F4B942" : "#ef4444" }}>{p.efficiency}%</span>
                      </div>
                    </td>
                    <td><StatusBadge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default SolarPanels;
