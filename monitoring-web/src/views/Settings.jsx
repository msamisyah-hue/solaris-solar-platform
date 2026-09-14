import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { AppContext } from "../AppContext";

class Settings extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      activeTab: "profile",
      profile: {
        name: "Ingénieur Admin",
        email: "admin@alromar-energies.ma",
        role: "Administrateur Système",
        org: "ALROMAR ENERGIES"
      },
      monitoring: {
        refreshInterval: "10",
        voltageThreshold: "10.5",
        tempThreshold: "65",
        effThreshold: "85"
      },
      notifications: {
        emailAlerts: true,
        criticalOnly: false,
        weeklyReport: true,
        maintenanceReminders: true
      },
      saved: false
    };
  }

  handleNotifToggle = (key) => {
    this.setState(prev => ({
      notifications: { ...prev.notifications, [key]: !prev.notifications[key] }
    }));
  };

  handleChange = (section, key, value) => {
    this.setState(prev => ({ [section]: { ...prev[section], [key]: value } }));
  };

  handleSave = () => {
    this.setState({ saved: true });
    setTimeout(() => this.setState({ saved: false }), 2500);
  };

  renderNotifToggle(key, title, desc) {
    const on = this.state.notifications[key];
    return (
      <div className="solaris-toggle" key={key}>
        <div className="solaris-toggle-label">
          <span className="solaris-toggle-title">{title}</span>
          <span className="solaris-toggle-desc">{desc}</span>
        </div>
        <button
          className={`solaris-switch ${on ? "on" : "off"}`}
          onClick={() => this.handleNotifToggle(key)}
          aria-label={title}
        />
      </div>
    );
  }

  render() {
    const { darkMode, tempUnit, setDarkMode, setTempUnit } = this.context;
    const { activeTab, profile, monitoring, saved } = this.state;

    return (
      <div className="content">
        <div className="solaris-page-header">
          <div>
            <h2 className="solaris-section-title">Paramètres</h2>
            <p className="solaris-section-subtitle">
              Configuration de la plateforme &amp; préférences
            </p>
          </div>
          <button className="solaris-btn-primary" onClick={this.handleSave}>
            <i className="fa fa-save" /> Enregistrer les modifications
          </button>
        </div>

        {saved && (
          <div style={{
            background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "8px",
            padding: "12px 16px", marginBottom: "20px", color: "#166534",
            fontSize: "13.5px", display: "flex", alignItems: "center", gap: "8px"
          }}>
            <i className="fa fa-check-circle" /> Paramètres enregistrés avec succès.
          </div>
        )}

        <Grid fluid style={{ padding: 0 }}>
          <Row>
            {/* Onglets gauche */}
            <Col md={3}>
              <div className="solaris-chart-card" style={{ padding: "8px" }}>
                {[
                  { key: "profile",       label: "Profil",         icon: "fa fa-user" },
                  { key: "monitoring",    label: "Surveillance",    icon: "pe-7s-signal" },
                  { key: "notifications", label: "Notifications",   icon: "fa fa-bell" },
                  { key: "system",        label: "Système",         icon: "fa fa-cog" },
                  { key: "about",         label: "À propos",        icon: "fa fa-info-circle" }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => this.setState({ activeTab: tab.key })}
                    style={{
                      width: "100%", textAlign: "left", padding: "11px 14px",
                      border: "none", borderRadius: "8px", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: "10px",
                      background: activeTab === tab.key ? "rgba(23,107,91,0.1)" : "transparent",
                      color: activeTab === tab.key ? "#176B5B" : "var(--solaris-text-secondary)",
                      fontWeight: activeTab === tab.key ? 700 : 500,
                      fontSize: "13.5px", marginBottom: "2px", transition: "all 0.15s",
                      borderLeft: activeTab === tab.key ? "3px solid #176B5B" : "3px solid transparent"
                    }}
                  >
                    <i className={tab.icon} style={{ fontSize: "15px", width: "16px", textAlign: "center" }} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </Col>

            {/* Contenu */}
            <Col md={9}>
              <div className="solaris-chart-card">

                {/* Profil */}
                {activeTab === "profile" && (
                  <div>
                    <div className="solaris-chart-header">
                      <p className="solaris-card-title">Paramètres du Profil</p>
                    </div>
                    <div style={{ padding: "24px" }}>
                      <div style={{
                        display: "flex", alignItems: "center", gap: "20px",
                        marginBottom: "28px", paddingBottom: "24px",
                        borderBottom: "1px solid var(--solaris-border)"
                      }}>
                        <div style={{
                          width: "72px", height: "72px", borderRadius: "50%",
                          background: "linear-gradient(135deg, #176B5B, #38A169)",
                          color: "white", display: "flex", alignItems: "center",
                          justifyContent: "center", fontSize: "26px", fontWeight: 800
                        }}>AD</div>
                        <div>
                          <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--solaris-text-primary)" }}>{profile.name}</div>
                          <div style={{ fontSize: "13px", color: "var(--solaris-text-muted)" }}>{profile.role}</div>
                          <div style={{ fontSize: "13px", color: "var(--solaris-text-muted)" }}>{profile.org}</div>
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        {[
                          { label: "Nom complet",    key: "name",  type: "text" },
                          { label: "Adresse e-mail", key: "email", type: "email" },
                          { label: "Rôle",           key: "role",  type: "text" },
                          { label: "Organisation",   key: "org",   type: "text" }
                        ].map(f => (
                          <div key={f.key} className="solaris-form-group">
                            <label className="solaris-form-label">{f.label}</label>
                            <input
                              type={f.type}
                              className="solaris-form-control"
                              value={profile[f.key]}
                              onChange={e => this.handleChange("profile", f.key, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Surveillance */}
                {activeTab === "monitoring" && (
                  <div>
                    <div className="solaris-chart-header">
                      <p className="solaris-card-title">Préférences de Surveillance</p>
                    </div>
                    <div style={{ padding: "24px" }}>
                      {/* Temperature unit — FUNCTIONAL */}
                      <div style={{
                        background: "#f0fdf4", border: "1px solid #86efac",
                        borderRadius: "8px", padding: "16px 20px", marginBottom: "20px"
                      }}>
                        <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#166534", marginBottom: "12px" }}>
                          <i className="fa fa-thermometer-half" style={{ marginRight: "8px" }} />
                          Unité de température
                          <span style={{ marginLeft: "8px", fontSize: "11.5px", fontWeight: 500, color: "#38A169" }}>
                            (actif — modifie toutes les températures)
                          </span>
                        </div>
                        <div className="solaris-btn-group">
                          <button
                            className={`solaris-btn-tab${tempUnit === "Celsius" ? " active" : ""}`}
                            onClick={() => setTempUnit("Celsius")}
                          >
                            °C — Celsius
                          </button>
                          <button
                            className={`solaris-btn-tab${tempUnit === "Fahrenheit" ? " active" : ""}`}
                            onClick={() => setTempUnit("Fahrenheit")}
                          >
                            °F — Fahrenheit
                          </button>
                        </div>
                        <div style={{ marginTop: "10px", fontSize: "12px", color: "#38A169" }}>
                          {tempUnit === "Fahrenheit"
                            ? "Les températures sont converties : ex. 35°C → 95°F"
                            : "Affichage en degrés Celsius (valeur brute du capteur)"
                          }
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div className="solaris-form-group">
                          <label className="solaris-form-label">Intervalle de rafraîchissement (secondes)</label>
                          <select
                            className="solaris-form-control"
                            value={monitoring.refreshInterval}
                            onChange={e => this.handleChange("monitoring", "refreshInterval", e.target.value)}
                          >
                            <option value="5">5 secondes</option>
                            <option value="10">10 secondes</option>
                            <option value="30">30 secondes</option>
                            <option value="60">1 minute</option>
                          </select>
                        </div>
                        <div className="solaris-form-group">
                          <label className="solaris-form-label">Seuil alerte basse tension (V)</label>
                          <input
                            type="number" step="0.1"
                            className="solaris-form-control"
                            value={monitoring.voltageThreshold}
                            onChange={e => this.handleChange("monitoring", "voltageThreshold", e.target.value)}
                          />
                        </div>
                        <div className="solaris-form-group">
                          <label className="solaris-form-label">Seuil alerte haute température (°C)</label>
                          <input
                            type="number"
                            className="solaris-form-control"
                            value={monitoring.tempThreshold}
                            onChange={e => this.handleChange("monitoring", "tempThreshold", e.target.value)}
                          />
                        </div>
                        <div className="solaris-form-group">
                          <label className="solaris-form-label">Seuil alerte rendement faible (%)</label>
                          <input
                            type="number"
                            className="solaris-form-control"
                            value={monitoring.effThreshold}
                            onChange={e => this.handleChange("monitoring", "effThreshold", e.target.value)}
                          />
                        </div>
                      </div>
                      <div style={{
                        background: "#fffbeb", border: "1px solid #fde68a",
                        borderRadius: "8px", padding: "12px 14px", fontSize: "13px", color: "#92400e"
                      }}>
                        <i className="fa fa-info-circle" style={{ marginRight: "6px" }} />
                        Les seuils sont stockés localement pour cette session de démonstration.
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications */}
                {activeTab === "notifications" && (
                  <div>
                    <div className="solaris-chart-header">
                      <p className="solaris-card-title">Préférences de Notifications</p>
                    </div>
                    <div style={{ padding: "24px" }}>
                      {this.renderNotifToggle("emailAlerts",         "Alertes par e-mail",           "Recevoir des notifications e-mail pour les nouvelles alertes")}
                      {this.renderNotifToggle("criticalOnly",         "Alertes critiques uniquement", "Notifier uniquement pour les alertes de niveau critique")}
                      {this.renderNotifToggle("weeklyReport",         "Rapport hebdomadaire",         "Recevoir un rapport de performance hebdomadaire")}
                      {this.renderNotifToggle("maintenanceReminders", "Rappels de maintenance",       "Être notifié 24h avant une maintenance planifiée")}
                    </div>
                  </div>
                )}

                {/* Système */}
                {activeTab === "system" && (
                  <div>
                    <div className="solaris-chart-header">
                      <p className="solaris-card-title">Préférences Système</p>
                    </div>
                    <div style={{ padding: "24px" }}>
                      {/* Dark mode — FUNCTIONAL */}
                      <div className="solaris-toggle">
                        <div className="solaris-toggle-label">
                          <span className="solaris-toggle-title">Mode sombre</span>
                          <span className="solaris-toggle-desc">
                            Activer le thème sombre pour toute l'interface
                            {darkMode && (
                              <span style={{ color: "#38A169", marginLeft: "8px", fontWeight: 600 }}>
                                — Activé ✓
                              </span>
                            )}
                          </span>
                        </div>
                        <button
                          className={`solaris-switch ${darkMode ? "on" : "off"}`}
                          onClick={() => setDarkMode(!darkMode)}
                          aria-label="Mode sombre"
                        />
                      </div>

                      <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--solaris-border)" }}>
                        <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--solaris-text-primary)", marginBottom: "8px" }}>
                          Source de données
                        </div>
                        <div style={{
                          background: "#f8fafc", border: "1px solid var(--solaris-border)",
                          borderRadius: "8px", padding: "14px 16px"
                        }}>
                          <div style={{ fontSize: "13px", color: "var(--solaris-text-secondary)", lineHeight: 1.6 }}>
                            <div>API Backend : <strong>http://localhost:3001</strong></div>
                            <div>Base de données : <strong>MySQL · solar_power_test</strong></div>
                            <div>Intervalle simulation : <strong>10 secondes</strong></div>
                            <div>Type : <strong>Prototype de démonstration — données simulées localement</strong></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* À propos */}
                {activeTab === "about" && (
                  <div>
                    <div className="solaris-chart-header">
                      <p className="solaris-card-title">À propos d'ALROMAR ENERGIES</p>
                    </div>
                    <div style={{ padding: "28px 24px" }}>
                      <div style={{
                        display: "flex", gap: "18px", alignItems: "flex-start",
                        marginBottom: "28px", paddingBottom: "24px",
                        borderBottom: "1px solid var(--solaris-border)"
                      }}>
                        <div style={{
                          width: "60px", height: "60px", borderRadius: "12px", flexShrink: 0,
                          background: "linear-gradient(135deg, #F4B942, #176B5B)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "white", fontSize: "28px", boxShadow: "0 4px 12px rgba(23,107,91,0.3)"
                        }}>
                          <i className="pe-7s-sun" />
                        </div>
                        <div>
                          <div style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "var(--solaris-text-primary)" }}>
                            ALROMAR ENERGIES
                          </div>
                          <div style={{ fontSize: "13px", color: "var(--solaris-text-muted)", marginTop: "2px" }}>
                            Plateforme de supervision et de suivi des installations photovoltaïques
                          </div>
                          <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
                            <span style={{ background: "#f1f5f9", padding: "3px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: 600, color: "var(--solaris-text-secondary)" }}>
                              Phase 2
                            </span>
                            <span style={{ background: "#f0fdf4", border: "1px solid #86efac", padding: "3px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: 600, color: "#166534" }}>
                              Prototype de démonstration
                            </span>
                          </div>
                        </div>
                      </div>

                      {[
                        { label: "Frontend",     value: "React 16 · react-router-dom v5 · Bootstrap 3 · Chart.js v2" },
                        { label: "Backend",      value: "Node.js · Express 4 · MySQL 2" },
                        { label: "Base données", value: "MySQL · solar_power_test (local)" },
                        { label: "Graphiques",   value: "react-chartjs-2 · react-gauge-chart" },
                        { label: "Données",      value: "Télémétrie simulée · intervalles 10s · Portefeuille marocain de démonstration" }
                      ].map((item, i) => (
                        <div key={i} style={{
                          display: "flex", gap: "16px", padding: "10px 0",
                          borderBottom: "1px solid #f1f5f9", alignItems: "flex-start"
                        }}>
                          <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", color: "var(--solaris-text-muted)", width: "110px", flexShrink: 0, paddingTop: "1px" }}>
                            {item.label}
                          </div>
                          <div style={{ fontSize: "13.5px", color: "var(--solaris-text-secondary)" }}>{item.value}</div>
                        </div>
                      ))}

                      <div style={{
                        marginTop: "20px", background: "#f8fafc", borderRadius: "8px",
                        padding: "14px 16px", fontSize: "12.5px", color: "var(--solaris-text-muted)", lineHeight: 1.6
                      }}>
                        Construit sur la base du template open-source{" "}
                        <a href="https://github.com/creativetimofficial/light-bootstrap-dashboard-react"
                          target="_blank" rel="noopener noreferrer"
                          style={{ color: "#176B5B" }}>
                          Light Bootstrap Dashboard React (v1.3.0)
                        </a>{" "}
                        par Creative Tim, sous licence MIT.
                        La licence originale est conservée dans LICENSE.md.
                        L'interface ALROMAR ENERGIES et les fonctionnalités étendues constituent le travail original de ce projet de stage.
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
