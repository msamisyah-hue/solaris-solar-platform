import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import axios from "axios";
import { AppContext } from "../AppContext";

import Surface_temp_chart from "components/Chart/Surface_temp_chart";
import Controller_output from "components/Controller_output.js";
import Solar_cell_voltage_chart from "components/Chart/Solar_cell_voltage_chart";
import Battery_voltage_chart from "components/Chart/Battery_voltage_chart";
import SurfaceAndChargeSpeedChart from "components/Chart/SurfaceAndChargeSpeedChart";

const API = "http://localhost:3001";

function LiveMetricCard({ label, value, unit, subLabel, subValue, icon, colorClass, barClass, pulse }) {
  return (
    <div className="solaris-kpi-card">
      <div className="solaris-kpi-top">
        <span className="solaris-kpi-label">{label}</span>
        <div className={`solaris-kpi-icon-box ${colorClass}`}>
          <i className={icon} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
        <span className="solaris-kpi-value">{value}</span>
        {unit && <span className="solaris-kpi-unit">{unit}</span>}
        {pulse && <span style={{ marginLeft: "8px" }}><span className="solaris-pulse-dot" style={{ display: "inline-block", verticalAlign: "middle" }} /></span>}
      </div>
      {subLabel && (
        <div className="solaris-kpi-bottom">
          <span style={{ color: "var(--solaris-text-muted)" }}>
            {subLabel} : <strong style={{ color: "var(--solaris-text-primary)" }}>{subValue}</strong>
          </span>
        </div>
      )}
      {barClass && <div className={`solaris-kpi-bar ${barClass}`} />}
    </div>
  );
}

class EnergyMonitoring extends Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = { live: null, liveSurface: null, lastUpdated: null, error: false };
  }

  componentDidMount() {
    this.fetchLive();
    this.pollInterval = setInterval(() => this.fetchLive(), 10000);
  }

  componentWillUnmount() {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  fetchLive() {
    Promise.all([
      axios.get(`${API}/controller_info_last`).catch(() => null),
      axios.get(`${API}/solar_info_last`).catch(() => null)
    ]).then(([ctrlRes, surfRes]) => {
      const ctrl = ctrlRes ? (ctrlRes.data || [])[0] : null;
      const surf = surfRes ? (surfRes.data || [])[0] : null;
      this.setState({ live: ctrl, liveSurface: surf, lastUpdated: new Date().toLocaleTimeString("fr-FR"), error: !ctrl });
    });
  }

  fmt(val, d = 2) {
    if (val === null || val === undefined) return "—";
    return parseFloat(val).toFixed(d);
  }

  calcPower(v, i) {
    if (!v || !i) return "—";
    return (parseFloat(v) * parseFloat(i)).toFixed(1);
  }

  getBatteryStateColor(state) {
    if (!state) return "var(--solaris-text-muted)";
    const s = state.toLowerCase();
    if (s === "bulk") return "#F4B942";
    if (s === "absorption") return "#0284c7";
    if (s === "float") return "#38A169";
    return "var(--solaris-text-muted)";
  }

  render() {
    const { live, liveSurface, lastUpdated, error } = this.state;
    const { convertTemp, getTempUnit } = this.context;
    const solarVoltage = this.fmt(live ? live.solar_voltage : null);
    const solarCurrent = this.fmt(live ? live.solar_current : null);
    const solarPower   = this.calcPower(live ? live.solar_voltage : null, live ? live.solar_current : null);
    const battVoltage  = this.fmt(live ? live.battery_voltage : null);
    const battCurrent  = this.fmt(live ? live.battery_current : null);
    const battState    = live ? live.battery_state : "—";
    const yieldKwh     = this.fmt(live ? live.yield_kwh : null, 2);
    const tempRaw      = liveSurface ? liveSurface.temperature : null;
    const temperature  = convertTemp(tempRaw);
    const tempUnit     = getTempUnit();
    const humidity     = this.fmt(liveSurface ? liveSurface.humidity : null, 0);

    return (
      <div className="content">
        <div className="solaris-page-header">
          <div>
            <h2 className="solaris-section-title">Surveillance Énergie</h2>
            <p className="solaris-section-subtitle">
              Télémétrie capteurs en temps réel · Mise à jour toutes les 10 secondes
              {lastUpdated && (
                <span style={{ marginLeft: "10px", color: "#38A169" }}>
                  <i className="fa fa-check-circle" style={{ marginRight: "4px" }} />
                  Dernière mise à jour : {lastUpdated}
                </span>
              )}
            </p>
          </div>
          <div className="solaris-status-pill">
            <span className="solaris-pulse-dot" />
            Flux de données en direct
          </div>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", color: "#dc2626", fontSize: "13.5px", display: "flex", alignItems: "center", gap: "10px" }}>
            <i className="fa fa-exclamation-triangle" />
            Impossible de contacter le backend sur {API}. Vérifiez que le serveur API est démarré sur le port 3001.
          </div>
        )}

        {/* Réseau solaire */}
        <div style={{ marginBottom: "8px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--solaris-text-muted)", margin: "0 0 14px 0" }}>
            <span role="img" aria-label="Réseau solaire">☀</span> Réseau Solaire
          </h3>
        </div>
        <div className="solaris-kpi-grid">
          <LiveMetricCard label="Tension Solaire" value={solarVoltage} unit="V" icon="fa fa-bolt" colorClass="solaris-kpi-icon-gold" barClass="solaris-kpi-bar-gold" subLabel="Tendance" subValue="Stable" pulse />
          <LiveMetricCard label="Courant Solaire" value={solarCurrent} unit="A" icon="fa fa-exchange" colorClass="solaris-kpi-icon-sky" barClass="solaris-kpi-bar-sky" subLabel="Phase" subValue="CC" pulse />
          <LiveMetricCard label="Puissance Solaire" value={solarPower} unit="W" icon="pe-7s-lightning" colorClass="solaris-kpi-icon-emerald" barClass="solaris-kpi-bar-emerald" subLabel="V × I" subValue={`${solarVoltage}V × ${solarCurrent}A`} pulse />
          <LiveMetricCard label="Production Cumulative" value={yieldKwh} unit="kWh" icon="pe-7s-signal" colorClass="solaris-kpi-icon-slate" barClass="solaris-kpi-bar-orange" subLabel="Total session" subValue="Cumulatif" pulse />
        </div>

        {/* Système batterie */}
        <div style={{ marginBottom: "8px", marginTop: "4px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--solaris-text-muted)", margin: "0 0 14px 0" }}>
            <span role="img" aria-label="Batterie">🔋</span> Système Batterie
          </h3>
        </div>
        <Grid fluid style={{ padding: 0, marginBottom: "24px" }}>
          <Row>
            <Col md={3} sm={6}>
              <LiveMetricCard label="Tension Batterie" value={battVoltage} unit="V" icon="fa fa-battery-three-quarters" colorClass="solaris-kpi-icon-sky" barClass="solaris-kpi-bar-sky" subLabel="Nominale" subValue="13.6 V" pulse />
            </Col>
            <Col md={3} sm={6}>
              <LiveMetricCard label="Courant Batterie" value={battCurrent} unit="A" icon="fa fa-plug" colorClass="solaris-kpi-icon-gold" barClass="solaris-kpi-bar-gold" subLabel="Direction" subValue="Charge" pulse />
            </Col>
            <Col md={3} sm={6}>
              <div className="solaris-kpi-card">
                <div className="solaris-kpi-top">
                  <span className="solaris-kpi-label">État Batterie</span>
                  <div className="solaris-kpi-icon-box solaris-kpi-icon-emerald">
                    <i className="fa fa-check-circle" />
                  </div>
                </div>
                <div>
                  <span className="solaris-kpi-value" style={{ fontSize: "22px", textTransform: "capitalize", color: this.getBatteryStateColor(battState) }}>
                    {battState}
                  </span>
                </div>
                <div className="solaris-kpi-bottom">
                  <span>Phase de charge</span>
                  <span className="solaris-pulse-dot" />
                </div>
                <div className="solaris-kpi-bar solaris-kpi-bar-emerald" />
              </div>
            </Col>
            <Col md={3} sm={6}>
              <LiveMetricCard label="Température Panneau" value={temperature} unit={tempUnit} icon="fa fa-thermometer-half" colorClass="solaris-kpi-icon-slate" barClass="solaris-kpi-bar-orange" subLabel="Humidité" subValue={`${humidity}%`} pulse />
            </Col>
          </Row>
        </Grid>

        {/* Graphiques en direct */}
        <div style={{ marginBottom: "8px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--solaris-text-muted)", margin: "0 0 14px 0" }}>
            📈 Graphiques Capteurs en Direct
          </h3>
        </div>
        <Grid fluid style={{ padding: 0 }}>
          <Row>
            <Col md={4}>
              <div className="solaris-chart-card">
                <div className="solaris-chart-header">
                  <div><p className="solaris-card-title" style={{ fontSize: "14px" }}>Température Surface Panneau</p><p className="solaris-card-subtitle">°C dans le temps</p></div>
                  <span className="solaris-status-pill" style={{ fontSize: "11px", padding: "4px 10px" }}><span className="solaris-pulse-dot" /> En direct</span>
                </div>
                <div className="solaris-chart-body"><Surface_temp_chart /></div>
              </div>
            </Col>
            <Col md={4}>
              <div className="solaris-chart-card">
                <div className="solaris-chart-header">
                  <div><p className="solaris-card-title" style={{ fontSize: "14px" }}>Tension Cellule Solaire</p><p className="solaris-card-subtitle">Volts dans le temps</p></div>
                  <span className="solaris-status-pill" style={{ fontSize: "11px", padding: "4px 10px" }}><span className="solaris-pulse-dot" /> En direct</span>
                </div>
                <div className="solaris-chart-body"><Solar_cell_voltage_chart /></div>
              </div>
            </Col>
            <Col md={4}>
              <div className="solaris-chart-card">
                <div className="solaris-chart-header">
                  <div><p className="solaris-card-title" style={{ fontSize: "14px" }}>Tension Batterie</p><p className="solaris-card-subtitle">Volts dans le temps</p></div>
                  <span className="solaris-status-pill" style={{ fontSize: "11px", padding: "4px 10px" }}><span className="solaris-pulse-dot" /> En direct</span>
                </div>
                <div className="solaris-chart-body"><Battery_voltage_chart /></div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <div className="solaris-chart-card">
                <div className="solaris-chart-header">
                  <div><p className="solaris-card-title" style={{ fontSize: "14px" }}>Sortie Contrôleur</p><p className="solaris-card-subtitle">Jauge de puissance &amp; lectures actuelles</p></div>
                  <span className="solaris-status-pill" style={{ fontSize: "11px", padding: "4px 10px" }}><span className="solaris-pulse-dot" /> En direct</span>
                </div>
                <div className="solaris-chart-body"><Controller_output /></div>
              </div>
            </Col>
            <Col md={6}>
              <div className="solaris-chart-card">
                <div className="solaris-chart-header">
                  <div><p className="solaris-card-title" style={{ fontSize: "14px" }}>Vitesse de Charge &amp; Température</p><p className="solaris-card-subtitle">Rendement kWh vs. température surface</p></div>
                  <span className="solaris-status-pill" style={{ fontSize: "11px", padding: "4px 10px" }}><span className="solaris-pulse-dot" /> En direct</span>
                </div>
                <div className="solaris-chart-body"><SurfaceAndChargeSpeedChart /></div>
              </div>
            </Col>
          </Row>
        </Grid>

        {/* Tableau lectures brutes */}
        <div style={{ marginTop: "8px" }}>
          <div className="solaris-chart-card">
            <div className="solaris-chart-header">
              <div><p className="solaris-card-title">Dernières Lectures Brutes</p><p className="solaris-card-subtitle">Instantané capteur le plus récent</p></div>
              <span style={{ fontSize: "12px", color: "var(--solaris-text-muted)" }}>{lastUpdated ? `Mis à jour ${lastUpdated}` : "En attente…"}</span>
            </div>
            <div className="solaris-table-wrapper">
              <table className="solaris-table">
                <thead>
                  <tr><th>Métrique</th><th>Valeur</th><th>Unité</th><th>Source</th><th>État</th></tr>
                </thead>
                <tbody>
                  {[
                    { metric: "Tension Solaire",    value: solarVoltage, unit: "V",   source: "Contrôleur",      ok: parseFloat(solarVoltage) > 0 },
                    { metric: "Courant Solaire",    value: solarCurrent, unit: "A",   source: "Contrôleur",      ok: parseFloat(solarCurrent) > 0 },
                    { metric: "Puissance Solaire",  value: solarPower,   unit: "W",   source: "Calculé",          ok: parseFloat(solarPower) > 0 },
                    { metric: "Tension Batterie",   value: battVoltage,  unit: "V",   source: "Contrôleur",      ok: parseFloat(battVoltage) > 10 },
                    { metric: "Courant Batterie",   value: battCurrent,  unit: "A",   source: "Contrôleur",      ok: parseFloat(battCurrent) > 0 },
                    { metric: "État Batterie",      value: battState,    unit: "—",   source: "Contrôleur",      ok: battState !== "—" },
                    { metric: "Production Cumul.",  value: yieldKwh,     unit: "kWh", source: "Contrôleur",      ok: true },
                    { metric: "Température Panneau",  value: temperature,  unit: tempUnit,  source: "Capteur Surface", ok: parseFloat(tempRaw) < 65 },
                    { metric: "Humidité",           value: humidity,     unit: "%",   source: "Capteur Surface", ok: true }
                  ].map((row, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{row.metric}</td>
                      <td style={{ fontWeight: 700, fontSize: "15px" }}>{row.value}</td>
                      <td style={{ color: "var(--solaris-text-muted)" }}>{row.unit}</td>
                      <td style={{ color: "var(--solaris-text-secondary)", fontSize: "12.5px" }}>{row.source}</td>
                      <td>
                        <span className={`solaris-badge ${row.ok ? "badge-operational" : "badge-warning"}`}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", display: "inline-block", background: row.ok ? "#38A169" : "#F4B942" }} />
                          {row.ok ? "Normal" : "Vérifier"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EnergyMonitoring;
