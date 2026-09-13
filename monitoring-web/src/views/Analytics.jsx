import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import DataBaseCard from "components/Card/DataBaseCard";

const TIME_PERIODS = [
  { label: "1H",       value: "L1H" },
  { label: "3H",       value: "L3H" },
  { label: "6H",       value: "L6H" },
  { label: "12H",      value: "L12H" },
  { label: "24H",      value: "LD" },
  { label: "7 Jours",  value: "LW" },
  { label: "30 Jours", value: "LM" }
];

class Analytics extends Component {
  constructor(props) {
    super(props);
    this.state = { activePeriod: "L1H" };
  }

  setPeriod = (val) => {
    this.setState({ activePeriod: val });
  };

  render() {
    const { activePeriod } = this.state;

    return (
      <div className="content">
        <div className="solaris-page-header">
          <div>
            <h2 className="solaris-section-title">Analytiques</h2>
            <p className="solaris-section-subtitle">
              Tendances historiques · Production, rendement, température &amp; données batterie
            </p>
          </div>
        </div>

        {/* Sélecteur de période global */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px", background: "white", border: "1px solid var(--solaris-border)", borderRadius: "10px", padding: "14px 20px", boxShadow: "var(--solaris-shadow-sm)" }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--solaris-text-muted)", marginRight: "4px" }}>
            Période :
          </span>
          <div className="solaris-btn-group">
            {TIME_PERIODS.map(p => (
              <button key={p.value} className={`solaris-btn-tab${activePeriod === p.value ? " active" : ""}`} onClick={() => this.setPeriod(p.value)}>
                {p.label}
              </button>
            ))}
          </div>
          <div style={{ marginLeft: "auto", fontSize: "12.5px", color: "var(--solaris-text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
            <i className="fa fa-database" /> Données historiques MySQL
          </div>
        </div>

        {/* Réseau solaire */}
        <div style={{ marginBottom: "10px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--solaris-text-muted)", margin: "0 0 16px 0" }}>
            ☀ Tendances Réseau Solaire
          </h3>
        </div>
        <Grid fluid style={{ padding: 0 }}>
          <Row>
            <Col md={6}>
              <div className="solaris-chart-card">
                <div className="solaris-chart-header">
                  <div>
                    <p className="solaris-card-title">Graphique Cellule Solaire</p>
                    <p className="solaris-card-subtitle">Tension (V) &amp; Courant (A) dans le temps</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#DC143C", fontWeight: 600 }}>
                      <span style={{ width: "18px", height: "3px", background: "#DC143C", borderRadius: "2px", display: "inline-block" }} /> Tension
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#6495ED", fontWeight: 600 }}>
                      <span style={{ width: "18px", height: "3px", background: "#6495ED", borderRadius: "2px", display: "inline-block" }} /> Courant
                    </span>
                  </div>
                </div>
                <div className="solaris-chart-body">
                  <DataBaseCard title="Solar Cell Chart" isMixed="1" externalPeriod={activePeriod} plain />
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="solaris-chart-card">
                <div className="solaris-chart-header">
                  <div>
                    <p className="solaris-card-title">Graphique Batterie</p>
                    <p className="solaris-card-subtitle">Tension (V) &amp; Courant (A) dans le temps</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#DC143C", fontWeight: 600 }}>
                      <span style={{ width: "18px", height: "3px", background: "#DC143C", borderRadius: "2px", display: "inline-block" }} /> Tension
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#6495ED", fontWeight: 600 }}>
                      <span style={{ width: "18px", height: "3px", background: "#6495ED", borderRadius: "2px", display: "inline-block" }} /> Courant
                    </span>
                  </div>
                </div>
                <div className="solaris-chart-body">
                  <DataBaseCard title="Battery Chart" isMixed="1" externalPeriod={activePeriod} plain />
                </div>
              </div>
            </Col>
          </Row>
        </Grid>

        {/* Température & Rendement */}
        <div style={{ marginBottom: "10px", marginTop: "8px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--solaris-text-muted)", margin: "0 0 16px 0" }}>
            🌡 Tendances Température &amp; Production
          </h3>
        </div>
        <Grid fluid style={{ padding: 0 }}>
          <Row>
            <Col md={6}>
              <div className="solaris-chart-card">
                <div className="solaris-chart-header">
                  <div>
                    <p className="solaris-card-title">Température Surface Panneau</p>
                    <p className="solaris-card-subtitle">°C sur la période sélectionnée</p>
                  </div>
                </div>
                <div className="solaris-chart-body">
                  <DataBaseCard title="Solar cell Suface temperature" externalPeriod={activePeriod} plain />
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="solaris-chart-card">
                <div className="solaris-chart-header">
                  <div>
                    <p className="solaris-card-title">Vitesse de Charge &amp; Température</p>
                    <p className="solaris-card-subtitle">Corrélation rendement kWh vs. température surface</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#DC143C", fontWeight: 600 }}>
                      <span style={{ width: "18px", height: "3px", background: "#DC143C", borderRadius: "2px", display: "inline-block" }} /> kWh
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#6495ED", fontWeight: 600 }}>
                      <span style={{ width: "18px", height: "3px", background: "#6495ED", borderRadius: "2px", display: "inline-block" }} /> °C
                    </span>
                  </div>
                </div>
                <div className="solaris-chart-body">
                  <DataBaseCard title="Charge Speed" isMixed="1" externalPeriod={activePeriod} plain />
                </div>
              </div>
            </Col>
          </Row>
        </Grid>

        {/* Notes d'analyse */}
        <div style={{ marginTop: "8px" }}>
          <div className="solaris-chart-card">
            <div className="solaris-chart-header">
              <div><p className="solaris-card-title">Notes d'Analyse</p><p className="solaris-card-subtitle">Guide d'interprétation pour ce jeu de données</p></div>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <Grid fluid style={{ padding: 0 }}>
                <Row>
                  {[
                    { icon: "fa fa-bolt", color: "#F4B942", title: "Tension Solaire", desc: "Plage typique 2–5 V pour cette simulation. Les heures de fort ensoleillement montrent des pics. Les valeurs sont corrélées au courant de sortie solaire." },
                    { icon: "fa fa-battery-three-quarters", color: "#0284c7", title: "Charge Batterie", desc: "La phase bulk domine en simulation. Une tension batterie de 10–14 V est la plage de fonctionnement normale pour un système 12 V." },
                    { icon: "fa fa-thermometer-half", color: "#ef4444", title: "Température Panneau", desc: "Une température de surface de 25–40 °C est normale. Le rendement diminue d'environ 0,5% par °C au-dessus de 25 °C pour les panneaux silicium." },
                    { icon: "pe-7s-signal", color: "#38A169", title: "Production (kWh)", desc: "Compteur de production cumulée. Utilisez la fenêtre 30 jours pour comparer les tendances de production quotidienne et détecter les dégradations." }
                  ].map((item, i) => (
                    <Col md={3} sm={6} key={i}>
                      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "12px", borderRadius: "8px", background: "#f8fafc", border: "1px solid var(--solaris-border)" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: item.color + "1a", color: item.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>
                          <i className={item.icon} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "13px", color: "var(--solaris-text-primary)", marginBottom: "4px" }}>{item.title}</div>
                          <div style={{ fontSize: "12px", color: "var(--solaris-text-muted)", lineHeight: 1.5 }}>{item.desc}</div>
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
