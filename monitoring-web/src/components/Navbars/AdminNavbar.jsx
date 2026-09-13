import React, { Component } from "react";
import axios from "axios";

class AdminNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertCount: 0,
      currentTime: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      currentDate: new Date().toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }),
      notifOpen: false
    };
    this.notifRef = React.createRef();
  }

  componentDidMount() {
    this.fetchAlertCount();
    this.clockInterval = setInterval(() => {
      this.setState({
        currentTime: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
      });
    }, 30000);
    document.addEventListener("mousedown", this.handleOutsideClick);
  }

  componentWillUnmount() {
    clearInterval(this.clockInterval);
    document.removeEventListener("mousedown", this.handleOutsideClick);
  }

  handleOutsideClick = (e) => {
    if (this.notifRef.current && !this.notifRef.current.contains(e.target)) {
      this.setState({ notifOpen: false });
    }
  };

  fetchAlertCount() {
    axios.get("http://localhost:3001/api/alerts")
      .then(res => res.data)
      .then(alerts => {
        const active = alerts.filter(a => a.status === "active").length;
        this.setState({ alertCount: active });
      })
      .catch(() => {});
  }

  toggleNotif = () => {
    this.setState(prev => ({ notifOpen: !prev.notifOpen }));
  };

  mobileSidebarToggle = (e) => {
    e.preventDefault();
    document.documentElement.classList.toggle("nav-open");
    if (this.props.onToggleSidebar) this.props.onToggleSidebar();
  };

  render() {
    const { brandText } = this.props;
    const { alertCount, currentTime, currentDate, notifOpen } = this.state;
    const pageName = brandText && brandText !== "ALROMAR ENERGIES" ? brandText : null;

    return (
      <div className="navbar-default solaris-navbar-wrapper">
        <div className="solaris-topbar">
          {/* Gauche : hamburger + titre page */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              className="solaris-hamburger"
              onClick={this.mobileSidebarToggle}
              aria-label="Menu"
            >
              <i className="fa fa-bars" />
            </button>
            <div className="solaris-topbar-title-group">
              <h1 className="solaris-page-title">{pageName || "Tableau de bord"}</h1>
              <div className="solaris-breadcrumbs">
                <span>ALROMAR ENERGIES</span>
                {pageName && (
                  <>
                    <i className="fa fa-angle-right" style={{ fontSize: "11px" }} />
                    <span>{pageName}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Droite : statut + heure + notifications + utilisateur */}
          <div className="solaris-topbar-actions">
            {/* Statut simulation */}
            <div className="solaris-status-pill">
              <span className="solaris-pulse-dot" />
              Simulation en direct
            </div>

            {/* Date/heure */}
            <div className="solaris-topbar-datetime">
              <span className="solaris-topbar-time">{currentTime}</span>
              <span className="solaris-topbar-date">{currentDate}</span>
            </div>

            {/* Notifications */}
            <div className="solaris-notif-wrapper" ref={this.notifRef}>
              <button
                className="solaris-icon-btn"
                onClick={this.toggleNotif}
                aria-label="Notifications"
              >
                <i className="fa fa-bell-o" />
                {alertCount > 0 && (
                  <span className="solaris-notif-badge">{alertCount}</span>
                )}
              </button>
              {notifOpen && (
                <div className="solaris-notif-dropdown">
                  <div className="solaris-notif-header">
                    <span>Notifications</span>
                    {alertCount > 0 && (
                      <span className="solaris-badge badge-critical" style={{ fontSize: "11px" }}>
                        {alertCount} active{alertCount > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <div className="solaris-notif-body">
                    {alertCount > 0 ? (
                      <div className="solaris-notif-item">
                        <i className="fa fa-exclamation-triangle" style={{ color: "#ef4444", marginRight: "8px" }} />
                        <span>{alertCount} alerte{alertCount > 1 ? "s" : ""} nécessite{alertCount > 1 ? "nt" : ""} votre attention</span>
                      </div>
                    ) : (
                      <div className="solaris-notif-empty">
                        <i className="fa fa-check-circle" style={{ color: "#38A169", fontSize: "22px" }} />
                        <p>Tous les systèmes sont opérationnels</p>
                      </div>
                    )}
                  </div>
                  <div className="solaris-notif-footer">
                    <a href="/admin/alerts" className="solaris-notif-link">
                      Voir toutes les alertes →
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Badge utilisateur */}
            <div className="solaris-user-badge">
              <div className="solaris-avatar">AD</div>
              <div className="solaris-user-info">
                <span className="solaris-user-name">Admin</span>
                <span className="solaris-user-role">Ingénieur</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminNavbar;
