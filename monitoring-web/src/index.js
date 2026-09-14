import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/css/light-bootstrap-dashboard-react.css";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css";
import "./assets/css/solaris.css";

import AdminLayout from "layouts/Admin.jsx";
import Login from "views/Login.jsx";
import PrivateRoute from "components/PrivateRoute.jsx";
import { AppProvider } from "./AppContext";

ReactDOM.render(
  <AppProvider>
    <BrowserRouter>
      <Switch>
        {/* Page de connexion — accessible sans authentification */}
        <Route path="/login" component={Login} />

        {/* Toutes les routes /admin/* sont protégées */}
        <PrivateRoute path="/admin" component={AdminLayout} />

        {/* Redirection racine → login */}
        <Redirect from="/" to="/login" />
      </Switch>
    </BrowserRouter>
  </AppProvider>,
  document.getElementById("root")
);
