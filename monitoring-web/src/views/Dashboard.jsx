import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { AppContext } from "../AppContext";

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
  const dot = { operational: "#38A169", warning: "#F4B942", maintenance: "#3b82f6", critical: "#ef4444" };
  return (
    <span className={`solaris-badge ${map[s] || "badge-info"}`}>
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", display: "inline-block", background: dot[s] || "#94a3b8" }} />
      {s === "operational" ? "Opérationnel" : s === "warning" ? "Avertissement" : s === "maintenance" ? "Maintenance" : status}
    </span>
  );
}

class Dashboard extends Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {
      stats: null,
      installations: [],
      recentAlerts: [],
      lastReading: null,
      loading: true
    };
  }

  componentDidMount() {
    this.loadData();
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
        installations: (instRes.data || []).slice(0, 5),
        recentAlerts: (alertsRes.data || []).filter(a => a.status === "active").slice(0, 4),
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
        {/* En-tête de page */}
        <div className="solaris-page-header">
          <div>
            <h2 className="solaris-section-title">Vue d'ensemble du portefeuille</h2>
            <p className="solaris-section-subtitle">
              Surveillance en temps réel de toutes les installations solaires · Données de simulation
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {activeAlerts > 0 && (
              <Link to="/admin/alerts" style={{ textDecoration: "none" }}>
                <span className="severity-critical">
                  <i className="fa fa-exclamation-triangle" />
                  {activeAlerts} alerte{activeAlerts > 1 ? "s" : ""} active{activeAlerts > 1 ? "s" : ""}
                </span>
              </Link>
            )}
            {upcomingMaint > 0 && (
              <Link to="/admin/maintenance" style={{ textDecoration: "none" }}>
                <span className="severity-info">
                  <i className="fa fa-wrench" />
                  {upcomingMaint} planifiée{upcomingMaint > 1 ? "s" : ""}
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* Cartes KPI principales */}
        <div className="solaris-kpi-grid">
          <KpiCard
            label="Installations Totales"
            value={totalInstallations}
            icon="pe-7s-map-marker"
            colorClass="solaris-kpi-icon-sky"
            barClass="solaris-kpi-bar-sky"
            trend="+1"
            trendLabel="ce trimestre"
          />
          <KpiCard
            label="Panneaux Solaires Actifs"
            value={totalPanels}
            icon="pe-7s-sun"
            colorClass="solaris-kpi-icon-gold"
            barClass="solaris-kpi-bar-gold"
            trendLabel={`${totalCapacity} kWp installés`}
          />
          <KpiCard
            label="Énergie Produite Aujourd'hui"
            value={dailyYield}
            unit="kWh"
            icon="pe-7s-lightning"
            colorClass="solaris-kpi-icon-emerald"
            barClass="solaris-kpi-bar-emerald"
            trend="↑ Pic"
            trendLabel="de production"
          />
          <KpiCard
            label="Rendement Moyen"
            value={avgEfficiency}
            unit="%"
            icon="pe-7s-signal"
            colorClass="solaris-kpi-icon-slate"
            barClass="solaris-kpi-bar-orange"
            trendLabel="moyenne du portefeuille"
          />
        </div>

        {/* Ligne KPI secondaire */}
        <Grid fluid style={{ padding: 0 }}>
          <Row>
            <Col md={3} sm={6}>
              <div className="solaris-kpi-card" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", border: "1px solid #86efac" }}>
                <div className="solaris-kpi-top">
                  <span className="solaris-kpi-label" style={{ color: "#166534" }}>CO₂ Compensé Aujourd'hui</span>
                  <div className="solaris-kpi-icon-box" style={{ background: "#38A169", color: "white" }}>
                    <i className="fa fa-leaf" />
                  </div>
                </div>
                <div>
                  <span className="solaris-kpi-value" style={{ color: "#166534" }}>{co2Offset}</span>
                  <span className="solaris-kpi-unit" style={{ color: "#16a34a" }}> tonnes</span>
                </div>
                <div className="solaris-kpi-bottom" style={{ color: "#16a34a" }}>
                  <span>≈ {stats ? stats.trees_equivalent : "—"} arbres absorbés</span>
                </div>
              </div>
            </Col>

            <Col md={3} sm={6}>
              <div className="solaris-kpi-card">
                <div className="solaris-kpi-top">
                  <span className="solaris-kpi-label">Tension Solaire en Direct</span>
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
                  <span>Courant solaire : {lastReading ? parseFloat(lastReading.solar_current).toFixed(2) : "—"} A</span>
                </div>
                <div className="solaris-kpi-bar solaris-kpi-bar-gold" />
              </div>
            </Col>

            <Col md={3} sm={6}>
              <div className="solaris-kpi-card">
                <div className="solaris-kpi-top">
                  <span className="solaris-kpi-label">Tension Batterie</span>
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
                  <span>État : {lastReading ? lastReading.battery_state : "—"}</span>
                </div>
                <div className="solaris-kpi-bar solaris-kpi-bar-sky" />
              </div>
            </Col>

            <Col md={3} sm={6}>
              <div className="solaris-kpi-card" style={activeAlerts > 0 ? { borderColor: "#fecaca" } : {}}>
                <div className="solaris-kpi-top">
                  <span className="solaris-kpi-label">Alertes Système</span>
                  <div className="solaris-kpi-icon-box" style={activeAlerts > 0 ? { background: "#fee2e2", color: "#dc2626" } : { background: "#dcfce7", color: "#16a34a" }}>
                    <i className={`fa fa-${activeAlerts > 0 ? "exclamation-triangle" : "check-circle"}`} />
                  </div>
                </div>
                <div>
                  <span className="solaris-kpi-value" style={activeAlerts > 0 ? { color: "#dc2626" } : { color: "#16a34a" }}>
                    {activeAlerts > 0 ? activeAlerts : "OK"}
                  </span>
                  {activeAlerts > 0 && <span className="solaris-kpi-unit">active{activeAlerts > 1 ? "s" : ""}</span>}
                </div>
                <div className="solaris-kpi-bottom">
                  <Link to="/admin/alerts" style={{ color: "#0284c7", fontSize: "12px", fontWeight: 600, textDecoration: "none" }}>
                    Voir toutes les alertes →
                  </Link>
                </div>
                <div className="solaris-kpi-bar" style={{ background: activeAlerts > 0 ? "linear-gradient(90deg, #ef4444, #f87171)" : "linear-gradient(90deg, #38A169, #48bb78)" }} />
              </div>
            </Col>
          </Row>
        </Grid>

        {/* Section télémétrie en direct */}
        <div style={{ marginTop: "12px", marginBottom: "8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--solaris-text-primary)", margin: "0 0 2px 0" }}>
              Télémétrie en Direct
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--solaris-text-muted)", margin: 0 }}>
              Données capteurs en temps réel · Mise à jour toutes les 10 secondes
            </p>
          </div>
          <Link to="/admin/energy" className="solaris-btn-outline" style={{ textDecoration: "none", fontSize: "12px" }}>
            <i className="pe-7s-lightning" /> Surveillance complète
          </Link>
        </div>

        <Grid fluid style={{ padding: 0 }}>
          <Row>
            <Col md={4}>
              <div className="solaris-chart-card">
                <div className="solaris-chart-header">
                  <div>
                    <p className="solaris-card-title" style={{ fontSize: "14px" }}>Température Surface Panneau</p>
                    <p className="solaris-card-subtitle">°C · Temps réel</p>
                  </div>
                  <span className="solaris-status-pill" style={{ fontSize: "11px", padding: "4px 10px" }}>
                    <span className="solaris-pulse-dot" /> En direct
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
                    <p className="solaris-card-title" style={{ fontSize: "14px" }}>Sortie Contrôleur</p>
                    <p className="solaris-card-subtitle">Jauge de puissance &amp; lectures</p>
                  </div>
                  <span className="solaris-status-pill" style={{ fontSize: "11px", padding: "4px 10px" }}>
                    <span className="solaris-pulse-dot" /> En direct
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
                    <p className="solaris-card-title" style={{ fontSize: "14px" }}>Vitesse de Charge &amp; Temp.</p>
                    <p className="solaris-card-subtitle">Rendement kWh vs. température surface</p>
                  </div>
                  <span className="solaris-status-pill" style={{ fontSize: "11px", padding: "4px 10px" }}>
                    <span className="solaris-pulse-dot" /> En direct
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
                    <p className="solaris-card-title" style={{ fontSize: "14px" }}>Tension Cellule Solaire</p>
                    <p className="solaris-card-subtitle">Volts · Tendance temps réel</p>
                  </div>
                  <Link to="/admin/analytics" className="solaris-btn-outline" style={{ textDecoration: "none", fontSize: "11px", padding: "5px 12px" }}>
                    Historique →
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
                    <p className="solaris-card-title" style={{ fontSize: "14px" }}>Tension Batterie</p>
                    <p className="solaris-card-subtitle">Volts · Tendance temps réel</p>
                  </div>
                  <Link to="/admin/analytics" className="solaris-btn-outline" style={{ textDecoration: "none", fontSize: "11px", padding: "5px 12px" }}>
                    Historique →
                  </Link>
                </div>
                <div className="solaris-chart-body" style={{ padding: "16px" }}>
                  <Battery_voltage_chart />
                </div>
              </div>
            </Col>
          </Row>
        </Grid>

        {/* Tableau installations + alertes récentes */}
        <Grid fluid style={{ padding: 0, marginTop: "8px" }}>
          <Row>
            <Col md={8}>
              <div className="solaris-chart-card">
                <div className="solaris-chart-header">
                  <div>
                    <p className="solaris-card-title">Portefeuille d'Installations</p>
                    <p className="solaris-card-subtitle">Production actuelle par site</p>
                  </div>
                  <Link to="/admin/installations" className="solaris-btn-outline" style={{ textDecoration: "none", fontSize: "12px" }}>
                    Voir tout →
                  </Link>
                </div>
                <div className="solaris-table-wrapper">
                  <table className="solaris-table" style={{ marginBottom: 0 }}>
                    <thead>
                      <tr>
                        <th>Installation</th>
                        <th>Localisation</th>
                        <th>Capacité</th>
                        <th>Production du jour</th>
                        <th>Rendement</th>
                        <th>État</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: "center", padding: "32px", color: "var(--solaris-text-muted)" }}>
                            <i className="fa fa-spinner fa-spin" style={{ marginRight: "8px" }} />
                            Chargement des installations…
                          </td>
                        </tr>
                      ) : installations.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: "center", padding: "32px", color: "var(--solaris-text-muted)" }}>
                            Aucune installation trouvée
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

            <Col md={4}>
              <div className="solaris-chart-card" style={{ height: "100%" }}>
                <div className="solaris-chart-header">
                  <div>
                    <p className="solaris-card-title">Alertes Actives</p>
                    <p className="solaris-card-subtitle">Nécessite une attention</p>
                  </div>
                  <Link to="/admin/alerts" className="solaris-btn-outline" style={{ textDecoration: "none", fontSize: "12px" }}>
                    Tout →
                  </Link>
                </div>
                <div style={{ padding: "8px 0" }}>
                  {recentAlerts.length === 0 ? (
                    <div className="solaris-empty-state">
                      <i className="fa fa-check-circle" style={{ color: "#38A169" }} />
                      <p>Tous les systèmes sont opérationnels</p>
                    </div>
                  ) : recentAlerts.map(alert => {
                    const sev = (alert.severity || "info").toLowerCase();
                    const icon = sev === "critical" ? "fa-exclamation-circle" : sev === "warning" ? "fa-exclamation-triangle" : "fa-info-circle";
                    const color = sev === "critical" ? "#dc2626" : sev === "warning" ? "#d97706" : "#0284c7";
                    return (
                      <div key={alert.id} style={{
                        padding: "14px 20px", borderBottom: "1px solid var(--solaris-border)",
                        display: "flex", gap: "12px", alignItems: "flex-start"
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
                            {sev === "critical" ? "Critique" : sev === "warning" ? "Avertissement" : "Info"}
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
