import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import AdminNavbarLinks from "../Navbars/AdminNavbarLinks.jsx";
import axios from "axios";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      activeAlerts: 0
    };
  }

  activeRoute(routeName) {
    const base = routeName.split("/:")[0];
    return this.props.location.pathname.indexOf(base) > -1 ? "active" : "";
  }

  updateDimensions() {
    this.setState({ width: window.innerWidth });
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
    this.fetchAlertCount();
    this.alertInterval = setInterval(() => this.fetchAlertCount(), 30000);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
    if (this.alertInterval) clearInterval(this.alertInterval);
  }

  fetchAlertCount() {
    axios.get("http://localhost:3001/api/alerts")
      .then(res => res.data)
      .then(alerts => {
        const active = alerts.filter(a => a.status === "active").length;
        this.setState({ activeAlerts: active });
      })
      .catch(() => {});
  }

  render() {
    let lastSection = null;

    return (
      <div id="sidebar" className="sidebar">
        {/* Logo ALROMAR ENERGIES */}
        <div className="logo">
          <NavLink to="/admin/dashboard" className="solaris-brand-wrapper">
            <div className="solaris-brand-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" fill="white" stroke="white" />
                <line x1="12" y1="2" x2="12" y2="5" />
                <line x1="12" y1="19" x2="12" y2="22" />
                <line x1="2" y1="12" x2="5" y2="12" />
                <line x1="19" y1="12" x2="22" y2="12" />
                <line x1="4.93" y1="4.93" x2="7.05" y2="7.05" />
                <line x1="16.95" y1="16.95" x2="19.07" y2="19.07" />
                <line x1="4.93" y1="19.07" x2="7.05" y2="16.95" />
                <line x1="16.95" y1="7.05" x2="19.07" y2="4.93" />
              </svg>
            </div>
            <div className="solaris-brand-text">
              <span className="solaris-brand-name">ALROMAR</span>
              <span className="solaris-brand-subtitle">ENERGIES</span>
            </div>
          </NavLink>
        </div>

        <div className="sidebar-wrapper">
          <ul className="nav">
            {this.state.width <= 991 ? <AdminNavbarLinks /> : null}

            {this.props.routes.map((prop, key) => {
              if (prop.hidden) return null;
              if (prop.redirect) return null;

              let showSectionHeader = false;
              if (prop.section && prop.section !== lastSection) {
                showSectionHeader = true;
                lastSection = prop.section;
              }

              let badgeValue = null;
              if (prop.badge === "active" && this.state.activeAlerts > 0) {
                badgeValue = this.state.activeAlerts;
              }

              return (
                <React.Fragment key={key}>
                  {showSectionHeader && (
                    <li className="solaris-nav-section-title">
                      {prop.section}
                    </li>
                  )}
                  <li className={this.activeRoute(prop.layout + prop.path)}>
                    <NavLink
                      to={prop.layout + prop.path.split("/:")[0]}
                      className="nav-link"
                      activeClassName="active"
                    >
                      <i className={prop.icon} />
                      <p>{prop.name}</p>
                      {badgeValue && (
                        <span className="solaris-badge-pill">{badgeValue}</span>
                      )}
                    </NavLink>
                  </li>
                </React.Fragment>
              );
            })}
          </ul>

          <div className="solaris-sidebar-footer">
            <div className="solaris-sidebar-footer-inner">
              <div className="solaris-pulse-dot" style={{ flexShrink: 0 }} />
              <span>Simulation active</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Sidebar;
