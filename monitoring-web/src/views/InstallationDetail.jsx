import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import DataBaseCard from "components/Card/DataBaseCard";

const API = "http://localhost:3001";

function StatusBadge({ status }) {
  const s = (status || "").toLowerCase();
  const map = { operational: "badge-operational", warning: "badge-warning", maintenance: "badge-maintenance", critical: "badge-critical", optimal: "badge-operational", "sub-optimal": "badge-warning", degraded: "badge-critical", scheduled: "badge-scheduled", "in progress": "badge-in-progress", completed: "badge-completed" };
  const dot = { operational: "#38A169", optimal: "#38A169", completed: "#38A169", warning: "#F4B942", "sub-optimal": "#F4B942", "in progress": "#F4B942", maintenance: "#3b82f6", scheduled: "#3b82f6", critical: "#ef4444", degraded: "#ef4444" };
  const labels = { operational: "Opérationnel", warning: "Avertissement", maintenance: "Maintenance", critical: "Critique", optimal: "Optimal", "sub-optimal": "Sous-optimal", degraded: "Dégradé", scheduled: "Planifié", "in progress": "En cours", completed: "Terminé" };
  return (
    <span className={`solaris-badge ${map[s] || "badge-info"}`}>
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", display: "inline-block", background: dot[s] || "#94a3b8" }} />
      {labels[s] || status}
    </span>
  );
}

const TIME_PERIODS = [
  { label: "1H", value: "L1H" }, { label: "3H", value: "L3H" }, { label: "6H", value: "L6H" },
  { label: "12H", value: "L12H" }, { label: "24H", value: "LD" }, { label: "7J", value: "LW" }, { label: "30J", value: "LM" }
];

class InstallationDetail extends Component {
  constructor(props) {
    super(props);
    this.state = { installation: null, loading: true, activeTab: "overview", timePeriod: "L1H", acknowledging: null };
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
        const updatedAlerts = installation.alerts.map(a => a.id === alertId ? { ...a, status: "acknowledged" } : a);
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
            Chargement des données d'installation…
          </div>
        </div>
      );
    }

    if (!installation) {
      return (
        <div className="content">
          <Link to="/admin/installations" className="solaris-back-link"><i className="fa fa-arrow-left" /> Retour aux Installations</Link>
          <div className="solaris-empty-state"><i className="fa fa-exclamation-triangle" /><p>Installation introuvable.</p></div>
        </div>
      );
    }

    const panels = installation.panels || [];
    const alerts = installation.alerts || [];
    const maintenance = installation.maintenance || [];
    const activeAlerts = alerts.filter(a => a.status === "active");

    return (
      <div className="content">
        <Link to="/admin/installations" className="solaris-back-link">
          <i className="fa fa-arrow-left" /> Retour aux Installations
        </Link>

        {/* En-tête */}
        <div style={{ background: "white", border: "1px solid var(--solaris-border)", borderRadius: "12px", padding: "24px 28px", marginBottom: "24px", boxShadow: "var(--solaris-shadow-sm)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", gap: "18px", alignItems: "flex-start" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "12px", background: "linear-gradient(135deg, #F4B942, #176B5B)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "26px", flexShrink: 0, boxShadow: "0 4px 12px rgba(23,107,91,0.3)" }}>
                <i className="pe-7s-sun" />
              </div>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--solaris-text-primary)", margin: "0 0 4px 0" }}>{installation.name}</h2>
                <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "12.5px", color: "var(--solaris-text-muted)", fontFamily: "monospace" }}>{installation.code}</span>
                  <span style={{ fontSize: "12.5px", color: "var(--solaris-text-muted)" }}><i className="fa fa-map-marker" style={{ marginRight: "4px" }} />{installation.location}</span>
                  <span style={{ fontSize: "12.5px", color: "var(--solaris-text-muted)" }}>{installation.region}</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              {activeAlerts.length > 0 && (
                <span className="severity-warning"><i className="fa fa-exclamation-triangle" /> {activeAlerts.length} alerte{activeAlerts.length > 1 ? "s" : ""}</span>
              )}
              <StatusBadge status={installation.status} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "0", marginTop: "22px", borderTop: "1px solid var(--solaris-border)", paddingTop: "20px" }}>
            {[
              { label: "Capacité Installée", value: installation.capacity_kw + " kWp" },
              { label: "Panneaux Totaux",    value: installation.panels_count.toLocaleString() },
              { label: "Puissance Actuelle", value: parseFloat(installation.current_power_kw).toFixed(1) + " kW" },
              { label: "Production du Jour", value: parseFloat(installation.daily_yield_kwh).toLocaleString() + " kWh" },
              { label: "Rendement",          value: parseFloat(installation.efficiency).toFixed(1) + "%" },
              { label: "Mise en Service",    value: installation.commissioned_date }
            ].map((m, i) => (
              <div key={i} style={{ padding: "0 20px", borderRight: i < 5 ? "1px solid var(--solaris-border)" : "none" }}>
                <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--solaris-text-muted)", marginBottom: "4px" }}>{m.label}</div>
                <div style={{ fontSize: "17px", fontWeight: 800, color: "var(--solaris-text-primary)" }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Onglets */}
        <div className="solaris-tabs">
          {[
            { key: "overview",    label: "Vue d'ensemble",   icon: "fa fa-th-large" },
            { key: "panels",      label: `Panneaux (${panels.length})`, icon: "pe-7s-sun" },
            { key: "alerts",      label: `Alertes (${activeAlerts.length})`, icon: "fa fa-bell" },
            { key: "maintenance", label: "Maintenance",       icon: "fa fa-wrench" },
            { key: "history",     label: "Historique Énergie", icon: "pe-7s-signal" }
          ].map(tab => (
            <button key={tab.key} className={`solaris-tab${activeTab === tab.key ? " active" : ""}`} onClick={() => this.setState({ activeTab: tab.key })}>
              <i className={tab.icon} style={{ marginRight: "6px" }} />{tab.label}
            </button>
          ))}
        </div>

        {/* Vue d'ensemble */}
        {activeTab === "overview" && (
          <Grid fluid style={{ padding: 0 }}>
            <Row>
              <Col md={8}>
                <div className="solaris-chart-card">
                  <div className="solaris-chart-header"><p className="solaris-card-title">Spécifications Techniques</p></div>
                  <div style={{ padding: "20px 24px" }}>
                    <div className="solaris-info-grid">
                      {[
                        { label: "Modèle Onduleur",    value: installation.inverter_model },
                        { label: "Capacité Installée", value: installation.capacity_kw + " kWp" },
                        { label: "Nombre de Panneaux", value: installation.panels_count.toLocaleString() },
                        { label: "Puissance Actuelle", value: parseFloat(installation.current_power_kw).toFixed(1) + " kW" },
                        { label: "Production du Jour", value: parseFloat(installation.daily_yield_kwh).toLocaleString() + " kWh" },
                        { label: "Rendement",          value: parseFloat(installation.efficiency).toFixed(1) + "%" },
                        { label: "Localisation",       value: installation.location },
                        { label: "Région",             value: installation.region },
                        { label: "Mise en Service",    value: installation.commissioned_date },
                        { label: "État",               value: installation.status }
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
                  <div className="solaris-chart-header"><p className="solaris-card-title">Résumé Performance</p></div>
                  <div style={{ padding: "20px 24px" }}>
                    <div style={{ marginBottom: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--solaris-text-secondary)" }}>Rendement</span>
                        <span style={{ fontSize: "15px", fontWeight: 800 }}>{parseFloat(installation.efficiency).toFixed(1)}%</span>
                      </div>
                      <div style={{ height: "10px", background: "#e2e8f0", borderRadius: "5px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${installation.efficiency}%`, borderRadius: "5px", background: installation.efficiency >= 91 ? "linear-gradient(90deg,#38A169,#48bb78)" : installation.efficiency >= 85 ? "linear-gradient(90deg,#F4B942,#fbbf24)" : "linear-gradient(90deg,#ef4444,#f87171)" }} />
                      </div>
                    </div>
                    <div style={{ marginBottom: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--solaris-text-secondary)" }}>Utilisation Capacité</span>
                        <span style={{ fontSize: "15px", fontWeight: 800 }}>{((installation.current_power_kw / installation.capacity_kw) * 100).toFixed(1)}%</span>
                      </div>
                      <div style={{ height: "10px", background: "#e2e8f0", borderRadius: "5px", overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: "5px", width: `${(installation.current_power_kw / installation.capacity_kw) * 100}%`, background: "linear-gradient(90deg, #176B5B, #38A169)" }} />
                      </div>
                    </div>
                    <div style={{ background: "#f0fdf4", borderRadius: "8px", padding: "14px", border: "1px solid #86efac" }}>
                      <div style={{ fontSize: "11.5px", fontWeight: 600, textTransform: "uppercase", color: "#166534", marginBottom: "4px" }}>CO₂ Compensé Aujourd'hui</div>
                      <div style={{ fontSize: "22px", fontWeight: 800, color: "#166534" }}>
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

        {/* Panneaux */}
        {activeTab === "panels" && (
          <div className="solaris-chart-card">
            <div className="solaris-chart-header">
              <p className="solaris-card-title">Actifs Panneaux — {installation.name}</p>
              <p className="solaris-card-subtitle">{panels.length} panneaux sur toutes les chaînes</p>
            </div>
            <div className="solaris-table-wrapper">
              <table className="solaris-table">
                <thead>
                  <tr><th>Code Panneau</th><th>Chaîne</th><th>Modèle</th><th>Tension</th><th>Courant</th><th>Puissance</th><th>Température</th><th>Rendement</th><th>État</th></tr>
                </thead>
                <tbody>
                  {panels.length === 0 ? (
                    <tr><td colSpan="9" style={{ textAlign: "center", padding: "32px", color: "var(--solaris-text-muted)" }}>Aucun panneau trouvé</td></tr>
                  ) : panels.map(p => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 600, fontFamily: "monospace", fontSize: "13px" }}>{p.panel_code}</td>
                      <td style={{ color: "var(--solaris-text-muted)" }}>{p.string_id}</td>
                      <td style={{ fontSize: "12.5px", color: "var(--solaris-text-secondary)" }}>{p.model}</td>
                      <td style={{ fontWeight: 600 }}>{p.voltage} <span style={{ color: "var(--solaris-text-muted)", fontWeight: 400, fontSize: "12px" }}>V</span></td>
                      <td style={{ fontWeight: 600 }}>{p.current} <span style={{ color: "var(--solaris-text-muted)", fontWeight: 400, fontSize: "12px" }}>A</span></td>
                      <td style={{ fontWeight: 600, color: "#F4B942" }}>{p.power_w} <span style={{ color: "var(--solaris-text-muted)", fontWeight: 400, fontSize: "12px" }}>W</span></td>
                      <td style={{ color: p.temperature_c > 45 ? "#ef4444" : "var(--solaris-text-primary)", fontWeight: 600 }}>{p.temperature_c} °C</td>
                      <td><span style={{ fontWeight: 700, color: p.efficiency >= 20 ? "#38A169" : p.efficiency >= 18 ? "#F4B942" : "#ef4444" }}>{p.efficiency}%</span></td>
                      <td><StatusBadge status={p.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Alertes */}
        {activeTab === "alerts" && (
          <div className="solaris-chart-card">
            <div className="solaris-chart-header">
              <p className="solaris-card-title">Alertes Système</p>
              <span>{activeAlerts.length} active{activeAlerts.length > 1 ? "s" : ""}</span>
            </div>
            <div>
              {alerts.length === 0 ? (
                <div className="solaris-empty-state"><i className="fa fa-check-circle" style={{ color: "#38A169" }} /><p>Aucune alerte pour cette installation</p></div>
              ) : alerts.map(alert => {
                const sev = (alert.severity || "info").toLowerCase();
                const icon = sev === "critical" ? "fa-exclamation-circle" : sev === "warning" ? "fa-exclamation-triangle" : "fa-info-circle";
                const color = sev === "critical" ? "#dc2626" : sev === "warning" ? "#d97706" : "#0284c7";
                return (
                  <div key={alert.id} style={{ padding: "16px 24px", borderBottom: "1px solid var(--solaris-border)", display: "flex", gap: "14px", alignItems: "flex-start", background: alert.status === "acknowledged" ? "#f8fafc" : "white", opacity: alert.status === "acknowledged" ? 0.7 : 1 }}>
                    <i className={`fa ${icon}`} style={{ color, fontSize: "18px", marginTop: "2px", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "4px" }}>{alert.title}</div>
                      <div style={{ fontSize: "13px", color: "var(--solaris-text-secondary)", marginBottom: "8px" }}>{alert.message}</div>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                        <span className={`severity-${sev}`}>{sev === "critical" ? "Critique" : sev === "warning" ? "Avertissement" : "Info"}</span>
                        <span style={{ fontSize: "12px", color: "var(--solaris-text-muted)" }}>{new Date(alert.created_at).toLocaleString("fr-FR")}</span>
                        {alert.status === "acknowledged" && <span className="solaris-badge badge-info">Accusé réception</span>}
                      </div>
                    </div>
                    {alert.status === "active" && (
                      <button className="solaris-btn-outline" style={{ fontSize: "12px", padding: "5px 12px", flexShrink: 0 }} disabled={acknowledging === alert.id} onClick={() => this.acknowledgeAlert(alert.id)}>
                        {acknowledging === alert.id ? <i className="fa fa-spinner fa-spin" /> : "Accuser réception"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Maintenance */}
        {activeTab === "maintenance" && (
          <div className="solaris-chart-card">
            <div className="solaris-chart-header"><p className="solaris-card-title">Journal de Maintenance</p></div>
            <div className="solaris-table-wrapper">
              <table className="solaris-table">
                <thead>
                  <tr><th>Type de Tâche</th><th>Technicien</th><th>Date Planifiée</th><th>État</th><th>Notes</th></tr>
                </thead>
                <tbody>
                  {maintenance.length === 0 ? (
                    <tr><td colSpan="5" style={{ textAlign: "center", padding: "32px", color: "var(--solaris-text-muted)" }}>Aucun enregistrement de maintenance</td></tr>
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

        {/* Historique */}
        {activeTab === "history" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", background: "white", border: "1px solid var(--solaris-border)", borderRadius: "10px", padding: "14px 20px", boxShadow: "var(--solaris-shadow-sm)" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--solaris-text-muted)" }}>Période :</span>
              <div className="solaris-btn-group">
                {TIME_PERIODS.map(p => (
                  <button key={p.value} className={`solaris-btn-tab${timePeriod === p.value ? " active" : ""}`} onClick={() => this.setState({ timePeriod: p.value })}>{p.label}</button>
                ))}
              </div>
            </div>
            <Grid fluid style={{ padding: 0 }}>
              <Row>
                <Col md={6}>
                  <div className="solaris-chart-card">
                    <div className="solaris-chart-header"><p className="solaris-card-title">Graphique Cellule Solaire</p><p className="solaris-card-subtitle">Tension &amp; Courant</p></div>
                    <div className="solaris-chart-body"><DataBaseCard title="Solar Cell Chart" isMixed="1" externalPeriod={timePeriod} plain /></div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="solaris-chart-card">
                    <div className="solaris-chart-header"><p className="solaris-card-title">Graphique Batterie</p><p className="solaris-card-subtitle">Tension &amp; Courant</p></div>
                    <div className="solaris-chart-body"><DataBaseCard title="Battery Chart" isMixed="1" externalPeriod={timePeriod} plain /></div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <div className="solaris-chart-card">
                    <div className="solaris-chart-header"><p className="solaris-card-title">Température Surface Panneau</p></div>
                    <div className="solaris-chart-body"><DataBaseCard title="Solar cell Suface temperature" externalPeriod={timePeriod} plain /></div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="solaris-chart-card">
                    <div className="solaris-chart-header"><p className="solaris-card-title">Vitesse de Charge &amp; Température</p></div>
                    <div className="solaris-chart-body"><DataBaseCard title="Charge Speed" isMixed="1" externalPeriod={timePeriod} plain /></div>
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
