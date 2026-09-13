import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import DataBaseCard from "components/Card/DataBaseCard";

const TIME_PERIODS = [
  { label: "1H",     value: "L1H" },
  { label: "3H",     value: "L3H" },
  { label: "6H",     value: "L6H" },
  { label: "12H",    value: "L12H" },
  { label: "24H",    value: "LD" },
  { label: "7 Days", value: "LW" },
  { label: "30 Days",value: "LM" }
];

class Analytics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePeriod: "L1H"
    };
  }

  setPeriod = (val) => {
    this.setState({ activePeriod: val });
  };

  render() {
    const { activePeriod } = this.state;

    return (
      <div className="content">
        {/* Page header */}
        <div className="solaris-page-header">
          <div>
            <h2 className="solaris-section-title">Analytics</h2>
            <p className="solaris-section-subtitle">
              Historical trends · Production, efficiency, temperature &amp; battery data
            </p>
          </div>
        </div>

        {/* Global time period selector */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "28px",
          background: "white",
          border: "1px solid var(--solaris-border)",
          borderRadius: "10px",
          padding: "14px 20px",
          boxShadow: "var(--solaris-shadow-sm)"
        }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--solaris-text-muted)", marginRight: "4px" }}>
            Time Window:
          </span>
          <div className="solaris-btn-group">
            {TIME_PERIODS.map(p => (
              <button
                key={p.value}
                className={`solaris-btn-tab${activePeriod === p.value ? " active" : ""}`}
                onClick={() => this.setPeriod(p.value)}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div style={{ marginLeft: "auto", fontSize: "12.5px", color: "var(--solaris-text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
            <i className="fa fa-database" />
            Historical data from MySQL
          </div>
        </div>

        {/* Section: Solar Array */}
        <div style={{ marginBottom: "10px" }}>
          <h3 style={{
            fontSize: "13px", fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.8px", color: "var(--solaris-text-muted)", margin: "0 0 16px 0"
          }}>
            ☀ Solar Array Trends
          </h3>
        </div>
        <Grid fluid style={{ padding: 0 }}>
          <Row>
            <Col md={6}>
              <div className="solaris-chart-card">
                <div className="solaris-chart-header">
                  <div>
                    <p className="solaris-card-title">Solar Cell Chart</p>
                    <p className="solaris-card-subtitle">Voltage (V) &amp; Current (A) over time</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#DC143C", fontWeight: 600 }}>
                      <span style={{ width: "18px", height: "3px", background: "#DC143C", borderRadius: "2px", display: "inline-block" }} />
                      Voltage
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#6495ED", fontWeight: 600 }}>
                      <span style={{ width: "18px", height: "3px", background: "#6495ED", borderRadius: "2px", display: "inline-block" }} />
                      Current
                    </span>
                  </div>
                </div>
                <div className="solaris-chart-body">
                  <DataBaseCard
                    title="Solar Cell Chart"
                    isMixed="1"
                    externalPeriod={activePeriod}
                    plain
                  />
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="solaris-chart-card">
                <div className="solaris-chart-header">
                  <div>
                    <p className="solaris-card-title">Battery Chart</p>
                    <p className="solaris-card-subtitle">Voltage (V) &amp; Current (A) over time</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#DC143C", fontWeight: 600 }}>
                      <span style={{ width: "18px", height: "3px", background: "#DC143C", borderRadius: "2px", display: "inline-block" }} />
                      Voltage
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#6495ED", fontWeight: 600 }}>
                      <span style={{ width: "18px", height: "3px", background: "#6495ED", borderRadius: "2px", display: "inline-block" }} />
                      Current
                    </span>
                  </div>
                </div>
                <div className="solaris-chart-body">
                  <DataBaseCard
                    title="Battery Chart"
                    isMixed="1"
                    externalPeriod={activePeriod}
                    plain
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Grid>

        {/* Section: Temperature & Yield */}
        <div style={{ marginBottom: "10px", marginTop: "8px" }}>
          <h3 style={{
            fontSize: "13px", fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.8px", color: "var(--solaris-text-muted)", margin: "0 0 16px 0"
          }}>
            🌡 Temperature &amp; Yield Trends
          </h3>
        </div>
        <Grid fluid style={{ padding: 0 }}>
          <Row>
            <Col md={6}>
              <div className="solaris-chart-card">
                <div className="solaris-chart-header">
                  <div>
                    <p className="solaris-card-title">Panel Surface Temperature</p>
                    <p className="solaris-card-subtitle">°C over selected period</p>
                  </div>
                </div>
                <div className="solaris-chart-body">
                  <DataBaseCard
                    title="Solar cell Suface temperature"
                    externalPeriod={activePeriod}
                    plain
                  />
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="solaris-chart-card">
                <div className="solaris-chart-header">
                  <div>
                    <p className="solaris-card-title">Charge Speed &amp; Temperature</p>
                    <p className="solaris-card-subtitle">kWh yield vs surface temperature correlation</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#DC143C", fontWeight: 600 }}>
                      <span style={{ width: "18px", height: "3px", background: "#DC143C", borderRadius: "2px", display: "inline-block" }} />
                      Yield kWh
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#6495ED", fontWeight: 600 }}>
                      <span style={{ width: "18px", height: "3px", background: "#6495ED", borderRadius: "2px", display: "inline-block" }} />
                      Temp °C
                    </span>
                  </div>
                </div>
                <div className="solaris-chart-body">
                  <DataBaseCard
                    title="Charge Speed"
                    isMixed="1"
                    externalPeriod={activePeriod}
                    plain
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Grid>

        {/* Insights summary */}
        <div style={{ marginTop: "8px" }}>
          <div className="solaris-chart-card">
            <div className="solaris-chart-header">
              <div>
                <p className="solaris-card-title">Analysis Notes</p>
                <p className="solaris-card-subtitle">Interpretation guide for this dataset</p>
              </div>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <Grid fluid style={{ padding: 0 }}>
                <Row>
                  {[
                    {
                      icon: "fa fa-bolt",
                      color: "#f59e0b",
                      title: "Solar Voltage",
                      desc: "Typical range 2–5 V for this simulation. Higher irradiance hours show peaks. Values correlate with solar current output."
                    },
                    {
                      icon: "fa fa-battery-three-quarters",
                      color: "#0284c7",
                      title: "Battery Charging",
                      desc: "Bulk phase dominates under simulation. Battery voltage 10–14 V is normal operating range for a 12 V lead-acid system."
                    },
                    {
                      icon: "fa fa-thermometer-half",
                      color: "#ef4444",
                      title: "Panel Temperature",
                      desc: "Surface temperature 25–40 °C is normal. Efficiency decreases approximately 0.5% per °C above 25 °C for silicon panels."
                    },
                    {
                      icon: "pe-7s-signal",
                      color: "#10b981",
                      title: "Yield (kWh)",
                      desc: "Cumulative yield counter. Use 30-day window to compare daily production trends and detect degradation patterns."
                    }
                  ].map((item, i) => (
                    <Col md={3} sm={6} key={i}>
                      <div style={{
                        display: "flex", gap: "12px", alignItems: "flex-start",
                        padding: "12px", borderRadius: "8px", background: "#f8fafc",
                        border: "1px solid var(--solaris-border)"
                      }}>
                        <div style={{
                          width: "36px", height: "36px", borderRadius: "8px",
                          background: item.color + "1a", color: item.color,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "16px", flexShrink: 0
                        }}>
                          <i className={item.icon} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "13px", color: "var(--solaris-text-primary)", marginBottom: "4px" }}>
                            {item.title}
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--solaris-text-muted)", lineHeight: 1.5 }}>
                            {item.desc}
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Grid>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Analytics;
