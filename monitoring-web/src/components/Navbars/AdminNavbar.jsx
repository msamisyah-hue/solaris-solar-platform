import React, { Component } from "react";
import axios from "axios";
import { AppContext } from "../../AppContext";

class AdminNavbar extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      alertCount: 0,
      currentTime: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      currentDate: new Date().toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }),
      notifOpen: false,
      userMenuOpen: false
    };
    this.notifRef  = React.createRef();
    this.userRef   = React.createRef();
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
    if (this.userRef.current && !this.userRef.current.contains(e.target)) {
      this.setState({ userMenuOpen: false });
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
    this.setState(prev => ({ notifOpen: !prev.notifOpen, userMenuOpen: false }));
  };

  toggleUserMenu = () => {
    this.setState(prev => ({ userMenuOpen: !prev.userMenuOpen, notifOpen: false }));
  };

  handleLogout = () => {
    this.context.logout();
    this.props.history && this.props.history.replace("/login");
    // Fallback if history not passed
    window.location.href = "/login";
  };

  mobileSidebarToggle = (e) => {
    e.preventDefault();
    document.documentElement.classList.toggle("nav-open");
    if (this.props.onToggleSidebar) this.props.onToggleSidebar();
  };

  render() {
    const { brandText } = this.props;
    const { alertCount, currentTime, currentDate, notifOpen, userMenuOpen } = this.state;
    const { user } = this.context;

    const pageName = brandText && brandText !== "ALROMAR ENERGIES" ? brandText : null;
    const displayName = user ? user.name : "Admin";
    const initials    = user ? user.initials : "AD";
    const role        = user ? user.role : "Ingénieur";

    return (
      <div className="navbar-default solaris-navbar-wrapper">
        <div className="solaris-topbar">
          {/* Gauche : hamburger + titre page */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button className="solaris-hamburger" onClick={this.mobileSidebarToggle} aria-label="Menu">
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

          {/* Droite */}
          <div className="solaris-topbar-actions">
            {/* Statut simulation */}
            <div className="solaris-status-pill">
              <span className="solaris-pulse-dot" />
              Simulation en direct
            </div>

            {/* Date / heure */}
            <div className="solaris-topbar-datetime">
              <span className="solaris-topbar-time">{currentTime}</span>
              <span className="solaris-topbar-date">{currentDate}</span>
            </div>

            {/* Notifications */}
            <div className="solaris-notif-wrapper" ref={this.notifRef}>
              <button className="solaris-icon-btn" onClick={this.toggleNotif} aria-label="Notifications">
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

            {/* Badge utilisateur + menu déconnexion */}
            <div className="solaris-notif-wrapper" ref={this.userRef}>
              <div
                className="solaris-user-badge"
                style={{ cursor: "pointer" }}
                onClick={this.toggleUserMenu}
              >
                <div className="solaris-avatar">{initials}</div>
                <div className="solaris-user-info">
                  <span className="solaris-user-name">{displayName}</span>
                  <span className="solaris-user-role">{role}</span>
                </div>
                <i
                  className={`fa fa-angle-${userMenuOpen ? "up" : "down"}`}
                  style={{ fontSize: "12px", color: "var(--solaris-text-muted)", marginLeft: "4px" }}
                />
              </div>

              {/* Menu utilisateur */}
              {userMenuOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 10px)", right: 0,
                  background: "white", border: "1px solid var(--solaris-border)",
                  borderRadius: "12px", boxShadow: "var(--solaris-shadow-lg)",
                  width: "220px", zIndex: 200,
                  animation: "modal-appear 0.15s ease-out"
                }}>
                  {/* User info header */}
                  <div style={{
                    padding: "16px", borderBottom: "1px solid var(--solaris-border)"
                  }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: "12px"
                    }}>
                      <div style={{
                        width: "40px", height: "40px", borderRadius: "50%",
                        background: "linear-gradient(135deg, #176B5B, #38A169)",
                        color: "white", display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: "15px", fontWeight: 800, flexShrink: 0
                      }}>
                        {initials}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "13.5px", color: "var(--solaris-text-primary)" }}>
                          {displayName}
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--solaris-text-muted)" }}>
                          {user ? user.email : ""}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div style={{ padding: "6px" }}>
                    <a
                      href="/admin/settings"
                      style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        padding: "10px 12px", borderRadius: "8px",
                        color: "var(--solaris-text-secondary)", textDecoration: "none",
                        fontSize: "13.5px", fontWeight: 500, transition: "background 0.12s"
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <i className="fa fa-cog" style={{ width: "16px", color: "var(--solaris-text-muted)" }} />
                      Paramètres
                    </a>

                    <div style={{ height: "1px", background: "var(--solaris-border)", margin: "6px 0" }} />

                    {/* Logout button */}
                    <button
                      onClick={this.handleLogout}
                      style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        padding: "10px 12px", borderRadius: "8px",
                        color: "#dc2626", background: "none", border: "none",
                        fontSize: "13.5px", fontWeight: 600, cursor: "pointer",
                        width: "100%", textAlign: "left", transition: "background 0.12s"
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <i className="fa fa-sign-out" style={{ width: "16px" }} />
                      Se déconnecter
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminNavbar;
