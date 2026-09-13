import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import axios from "axios";

// Existing real-time chart components
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
        {pulse && (
          <span style={{ marginLeft: "8px" }}>
            <span className="solaris-pulse-dot" style={{ display: "inline-block", verticalAlign: "middle" }} />
          </span>
        )}
      </div>
      {subLabel && (
        <div className="solaris-kpi-bottom">
          <span style={{ color: "var(--solaris-text-muted)" }}>
            {subLabel}: <strong style={{ color: "var(--solaris-text-primary)" }}>{subValue}</strong>
          </span>
        </div>
      )}
      {barClass && <div className={`solaris-kpi-bar ${barClass}`} />}
    </div>
  );
}

class EnergyMonitoring extends Component {
  constructor(props) {
    super(props);
    this.state = {
      live: null,
      liveSurface: null,
      lastUpdated: null,
      error: false
    };
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
      this.setState({
        live: ctrl,
        liveSurface: surf,
        lastUpdated: new Date().toLocaleTimeString(),
        error: !ctrl
      });
    });
  }

  fmt(val, d = 2) {
    if (val === null || val === undefined) return "—";
    return parseFloat(val).toFixed(d);
  }

  calcPower(voltage, current) {
    if (!voltage || !current) return "—";
    return (parseFloat(voltage) * parseFloat(current)).toFixed(1);
  }

  calcEfficiency(voltage, current) {
    // Simple proxy: ratio of actual solar power to battery power
    if (!voltage || !current) return "—";
    const solarPower = parseFloat(voltage) * parseFloat(current);
    // Rated capacity proxy ~15W per unit of yield
    const ratio = Math.min((solarPower / 15) * 100, 100);
    return ratio.toFixed(1);
  }

  getBatteryStateColor(state) {
    if (!state) return "var(--solaris-text-muted)";
    const s = state.toLowerCase();
    if (s === "bulk") return "#f59e0b";
    if (s === "absorption") return "#0284c7";
    if (s === "float") return "#10b981";
    return "var(--solaris-text-muted)";
  }

  render() {
    const { live, liveSurface, lastUpdated, error } = this.state;

    const solarVoltage  = this.fmt(live ? live.solar_voltage : null);
    const solarCurrent  = this.fmt(live ? live.solar_current : null);
    const solarPower    = this.calcPower(live ? live.solar_voltage : null, live ? live.solar_current : null);
    const battVoltage   = this.fmt(live ? live.battery_voltage : null);
    const battCurrent   = this.fmt(live ? live.battery_current : null);
    const battState     = live ? live.battery_state : "—";
    const yieldKwh      = this.fmt(live ? live.yield_kwh : null, 2);
    const temperature   = this.fmt(liveSurface ? liveSurface.temperature : null, 1);
    const humidity      = this.fmt(liveSurface ? liveSurface.humidity : null, 0);

    return (
      <div className="content">
        {/* Page header */}
        <div className="solaris-page-header">
          <div>
            <h2 className="solaris-section-title">Energy Monitoring</h2>
            <p className="solaris-section-subtitle">
              Real-time sensor telemetry · Updates every 10 seconds
              {lastUpdated && (
                <span style={{ marginLeft: "10px", color: "var(--solaris-emerald)" }}>
                  <i className="fa fa-check-circle" style={{ marginRight: "4px" }} />
                  Last update: {lastUpdated}
                </span>
              )}
            </p>
          </div>
          <div className="solaris-status-pill">
            <span className="solaris-pulse-dot" />
            Live Data Stream
          </div>
        </div>

        {error && (
          <div style={{
            background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px",
            padding: "12px 16px", marginBottom: "20px", color: "#dc2626", fontSize: "13.5px",
            display: "flex", alignItems: "center", gap: "10px"
          }}>
            <i className="fa fa-exclamation-triangle" />
            Cannot reach backend at {API}. Ensure the API server is running on port 3001.
          </div>
        )}

        {/* === SOLAR PANEL METRICS === */}
        <div style={{ marginBottom: "8px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--solaris-text-muted)", margin: "0 0 14px 0" }}>
            <span role="img" aria-label="Solar Array">☀</span> Solar Array
          </h3>
        </div>
        <div className="solaris-kpi-grid">
          <LiveMetricCard
            label="Solar Voltage"
            value={solarVoltage}
            unit="V"
            icon="fa fa-bolt"
            colorClass="solaris-kpi-icon-gold"
            barClass="solaris-kpi-bar-gold"
            subLabel="Trend"
            subValue="Stable"
            pulse
          />
          <LiveMetricCard
            label="Solar Current"
            value={solarCurrent}
            unit="A"
            icon="fa fa-exchange"
            colorClass="solaris-kpi-icon-sky"
            barClass="solaris-kpi-bar-sky"
            subLabel="Phase"
            subValue="DC"
            pulse
          />
          <LiveMetricCard
            label="Solar Power"
            value={solarPower}
            unit="W"
            icon="pe-7s-lightning"
            colorClass="solaris-kpi-icon-emerald"
            barClass="solaris-kpi-bar-emerald"
            subLabel="V × I"
            subValue={`${solarVoltage}V × ${solarCurrent}A`}
            pulse
          />
          <LiveMetricCard
            label="Cumulative Yield"
            value={yieldKwh}
            unit="kWh"
            icon="pe-7s-signal"
            colorClass="solaris-kpi-icon-slate"
            barClass="solaris-kpi-bar-orange"
            subLabel="Session total"
            subValue="Rolling"
            pulse
          />
        </div>

        {/* === BATTERY METRICS === */}
        <div style={{ marginBottom: "8px", marginTop: "4px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--solaris-text-muted)", margin: "0 0 14px 0" }}>
            <span role="img" aria-label="Battery">🔋</span> Battery System
          </h3>
        </div>
        <Grid fluid style={{ padding: 0, marginBottom: "24px" }}>
          <Row>
            <Col md={3} sm={6}>
              <LiveMetricCard
                label="Battery Voltage"
                value={battVoltage}
                unit="V"
                icon="fa fa-battery-three-quarters"
                colorClass="solaris-kpi-icon-sky"
                barClass="solaris-kpi-bar-sky"
                subLabel="Nominal"
                subValue="13.6 V"
                pulse
              />
            </Col>
            <Col md={3} sm={6}>
              <LiveMetricCard
                label="Battery Current"
                value={battCurrent}
                unit="A"
                icon="fa fa-plug"
                colorClass="solaris-kpi-icon-gold"
                barClass="solaris-kpi-bar-gold"
                subLabel="Direction"
                subValue="Charging"
                pulse
              />
            </Col>
            <Col md={3} sm={6}>
              <div className="solaris-kpi-card">
                <div className="solaris-kpi-top">
                  <span className="solaris-kpi-label">Battery State</span>
                  <div className="solaris-kpi-icon-box solaris-kpi-icon-emerald">
                    <i className="fa fa-check-circle" />
                  </div>
                </div>
                <div>
                  <span className="solaris-kpi-value" style={{
                    fontSize: "22px",
                    textTransform: "capitalize",
                    color: this.getBatteryStateColor(battState)
                  }}>
                    {battState}
                  </span>
                </div>
                <div className="solaris-kpi-bottom">
                  <span>Charge phase</span>
                  <span className="solaris-pulse-dot" />
                </div>
                <div className="solaris-kpi-bar solaris-kpi-bar-emerald" />
              </div>
            </Col>
            <Col md={3} sm={6}>
              <LiveMetricCard
                label="Panel Temperature"
                value={temperature}
                unit="°C"
                icon="fa fa-thermometer-half"
                colorClass="solaris-kpi-icon-slate"
                barClass="solaris-kpi-bar-orange"
                subLabel="Humidity"
                subValue={`${humidity}%`}
                pulse
              />
            </Col>
          </Row>
        </Grid>

        {/* === REAL-TIME CHARTS === */}
        <div style={{ marginBottom: "8px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--solaris-text-muted)", margin: "0 0 14px 0" }}>
            📈 Live Sensor Charts
          </h3>
        </div>
        <Grid fluid style={{ padding: 0 }}>
          <Row>
            <Col md={4}>
              <div className="solaris-chart-card">
                <div className="solaris-chart-header">
                  <div>
                    <p className="solaris-card-title" style={{ fontSize: "14px" }}>Panel Surface Temperature</p>
                    <p className="solaris-card-subtitle">°C over time</p>
                  </div>
                  <span className="solaris-status-pill" style={{ fontSize: "11px", padding: "4px 10px" }}>
                    <span className="solaris-pulse-dot" /> Live
                  </span>
                </div>
                <div className="solaris-chart-body">
                  <Surface_temp_chart />
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className="solaris-chart-card">
                <div className="solaris-chart-header">
                  <div>
                    <p className="solaris-card-title" style={{ fontSize: "14px" }}>Solar Cell Voltage</p>
                    <p className="solaris-card-subtitle">Volts over time</p>
                  </div>
                  <span className="solaris-status-pill" style={{ fontSize: "11px", padding: "4px 10px" }}>
                    <span className="solaris-pulse-dot" /> Live
                  </span>
                </div>
                <div className="solaris-chart-body">
                  <Solar_cell_voltage_chart />
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className="solaris-chart-card">
                <div className="solaris-chart-header">
                  <div>
                    <p className="solaris-card-title" style={{ fontSize: "14px" }}>Battery Voltage</p>
                    <p className="solaris-card-subtitle">Volts over time</p>
                  </div>
                  <span className="solaris-status-pill" style={{ fontSize: "11px", padding: "4px 10px" }}>
                    <span className="solaris-pulse-dot" /> Live
                  </span>
                </div>
                <div className="solaris-chart-body">
                  <Battery_voltage_chart />
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <div className="solaris-chart-card">
                <div className="solaris-chart-header">
                  <div>
                    <p className="solaris-card-title" style={{ fontSize: "14px" }}>Controller Output</p>
                    <p className="solaris-card-subtitle">Power gauge &amp; current readings</p>
                  </div>
                  <span className="solaris-status-pill" style={{ fontSize: "11px", padding: "4px 10px" }}>
                    <span className="solaris-pulse-dot" /> Live
                  </span>
                </div>
                <div className="solaris-chart-body">
                  <Controller_output />
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="solaris-chart-card">
                <div className="solaris-chart-header">
                  <div>
                    <p className="solaris-card-title" style={{ fontSize: "14px" }}>Charge Speed &amp; Temperature</p>
                    <p className="solaris-card-subtitle">kWh yield vs surface temperature</p>
                  </div>
                  <span className="solaris-status-pill" style={{ fontSize: "11px", padding: "4px 10px" }}>
                    <span className="solaris-pulse-dot" /> Live
                  </span>
                </div>
                <div className="solaris-chart-body">
                  <SurfaceAndChargeSpeedChart />
                </div>
              </div>
            </Col>
          </Row>
        </Grid>

        {/* Raw data table */}
        <div style={{ marginTop: "8px" }}>
          <div className="solaris-chart-card">
            <div className="solaris-chart-header">
              <div>
                <p className="solaris-card-title">Latest Raw Readings</p>
                <p className="solaris-card-subtitle">Most recent sensor snapshot</p>
              </div>
              <span style={{ fontSize: "12px", color: "var(--solaris-text-muted)" }}>
                {lastUpdated ? `Updated ${lastUpdated}` : "Waiting…"}
              </span>
            </div>
            <div className="solaris-table-wrapper">
              <table className="solaris-table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Value</th>
                    <th>Unit</th>
                    <th>Source</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { metric: "Solar Voltage",    value: solarVoltage,  unit: "V",   source: "Controller", ok: parseFloat(solarVoltage) > 0 },
                    { metric: "Solar Current",    value: solarCurrent,  unit: "A",   source: "Controller", ok: parseFloat(solarCurrent) > 0 },
                    { metric: "Solar Power",      value: solarPower,    unit: "W",   source: "Calculated",  ok: parseFloat(solarPower) > 0 },
                    { metric: "Battery Voltage",  value: battVoltage,   unit: "V",   source: "Controller", ok: parseFloat(battVoltage) > 10 },
                    { metric: "Battery Current",  value: battCurrent,   unit: "A",   source: "Controller", ok: parseFloat(battCurrent) > 0 },
                    { metric: "Battery State",    value: battState,     unit: "—",   source: "Controller", ok: battState !== "—" },
                    { metric: "Cumul. Yield",     value: yieldKwh,      unit: "kWh", source: "Controller", ok: true },
                    { metric: "Panel Temp.",      value: temperature,   unit: "°C",  source: "Surface Sensor", ok: parseFloat(temperature) < 65 },
                    { metric: "Humidity",         value: humidity,      unit: "%",   source: "Surface Sensor", ok: true }
                  ].map((row, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600, color: "var(--solaris-text-primary)" }}>{row.metric}</td>
                      <td style={{ fontWeight: 700, fontSize: "15px", color: "var(--solaris-text-primary)" }}>{row.value}</td>
                      <td style={{ color: "var(--solaris-text-muted)" }}>{row.unit}</td>
                      <td style={{ color: "var(--solaris-text-secondary)", fontSize: "12.5px" }}>{row.source}</td>
                      <td>
                        <span className={`solaris-badge ${row.ok ? "badge-operational" : "badge-warning"}`}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", display: "inline-block", background: row.ok ? "#10b981" : "#f59e0b" }} />
                          {row.ok ? "Normal" : "Check"}
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
