import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import Sidebar from "components/Sidebar/Sidebar";
import AdminNavbar from "components/Navbars/AdminNavbar";
import Footer from "components/Footer/Footer";

import routes from "routes.js";

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarOpen: true
    };
  }

  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            render={props => <prop.component {...props} />}
            key={key}
          />
        );
      }
      return null;
    });
  };

  getPageName = path => {
    for (let i = 0; i < routes.length; i++) {
      if (this.props.location.pathname.indexOf(routes[i].layout + routes[i].path.split("/:")[0]) !== -1) {
        return routes[i].name;
      }
    }
    return "SOLARIS";
  };

  toggleSidebar = () => {
    this.setState(prev => ({ sidebarOpen: !prev.sidebarOpen }));
    document.documentElement.classList.toggle("nav-open");
  };

  render() {
    return (
      <div className="wrapper">
        <Sidebar
          {...this.props}
          routes={routes}
        />
        <div id="main-panel" className="main-panel" ref="mainPanel">
          <AdminNavbar
            {...this.props}
            brandText={this.getPageName(this.props.location.pathname)}
            onToggleSidebar={this.toggleSidebar}
          />
          <Switch>{this.getRoutes(routes)}</Switch>
          <Footer />
        </div>
      </div>
    );
  }
}

export default Admin;
