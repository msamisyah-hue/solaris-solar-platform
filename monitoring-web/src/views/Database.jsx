/**
 * Legacy view — not used in current navigation.
 * Preserved for reference only. See Analytics.jsx for the active historical charts page.
 */
import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import DataBaseCard from "components/Card/DataBaseCard";

class Database extends Component {
  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <div className="solaris-chart-card">
                <div className="solaris-chart-header">
                  <p className="solaris-card-title">Historique (vue archivée)</p>
                  <p className="solaris-card-subtitle">
                    Veuillez utiliser la page Analytiques pour l'historique complet.
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Database;
