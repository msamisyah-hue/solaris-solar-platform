import React from "react";
import { Route, Redirect } from "react-router-dom";
import { AppContext } from "../AppContext";

/**
 * PrivateRoute — Protège toutes les routes /admin/*
 * Redirige vers /login si l'utilisateur n'est pas authentifié.
 */
const PrivateRoute = ({ component: Component, ...rest }) => (
  <AppContext.Consumer>
    {({ isAuthenticated }) => (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{ pathname: "/login", state: { from: props.location } }}
            />
          )
        }
      />
    )}
  </AppContext.Consumer>
);

export default PrivateRoute;
