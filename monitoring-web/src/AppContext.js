import React, { createContext, Component } from "react";

// Global app context: preferences + authentication
export const AppContext = createContext({
  darkMode: false,
  tempUnit: "Celsius",
  isAuthenticated: false,
  user: null,
  setDarkMode: () => {},
  setTempUnit: () => {},
  convertTemp: (celsius) => celsius,
  getTempUnit: () => "°C",
  login: () => {},
  logout: () => {}
});

// Demo credentials — stored in code for prototype only
// In production, this would be validated server-side
const DEMO_USERS = [
  {
    email: "admin@alromar-energies.ma",
    password: "Alromar2025",
    name: "Ingénieur Admin",
    role: "Administrateur Système",
    initials: "AD"
  }
];

export class AppProvider extends Component {
  constructor(props) {
    super(props);

    // Load persisted preferences from localStorage
    const savedDark  = localStorage.getItem("alromar_darkMode") === "true";
    const savedUnit  = localStorage.getItem("alromar_tempUnit") || "Celsius";
    const savedUser  = (() => {
      try {
        const u = localStorage.getItem("alromar_user");
        return u ? JSON.parse(u) : null;
      } catch {
        return null;
      }
    })();

    this.state = {
      darkMode: savedDark,
      tempUnit: savedUnit,
      isAuthenticated: !!savedUser,
      user: savedUser
    };

    if (savedDark) {
      document.body.classList.add("alromar-dark");
    } else {
      document.body.classList.remove("alromar-dark");
    }
  }

  // ── Authentication ────────────────────────────────────────────────────────
  login = (email, password) => {
    const match = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase().trim() &&
           u.password === password
    );
    if (match) {
      const userData = { email: match.email, name: match.name, role: match.role, initials: match.initials };
      localStorage.setItem("alromar_user", JSON.stringify(userData));
      this.setState({ isAuthenticated: true, user: userData });
      return { success: true };
    }
    return { success: false, message: "Identifiants incorrects. Vérifiez votre e-mail et mot de passe." };
  };

  logout = () => {
    localStorage.removeItem("alromar_user");
    this.setState({ isAuthenticated: false, user: null });
  };

  // ── Preferences ──────────────────────────────────────────────────────────
  setDarkMode = (value) => {
    localStorage.setItem("alromar_darkMode", value);
    this.setState({ darkMode: value });
    if (value) {
      document.body.classList.add("alromar-dark");
    } else {
      document.body.classList.remove("alromar-dark");
    }
  };

  setTempUnit = (unit) => {
    localStorage.setItem("alromar_tempUnit", unit);
    this.setState({ tempUnit: unit });
  };

  convertTemp = (celsius) => {
    if (celsius === null || celsius === undefined || celsius === "—") return "—";
    const c = parseFloat(celsius);
    if (isNaN(c)) return "—";
    if (this.state.tempUnit === "Fahrenheit") {
      return ((c * 9) / 5 + 32).toFixed(1);
    }
    return c.toFixed(1);
  };

  getTempUnit = () => {
    return this.state.tempUnit === "Fahrenheit" ? "°F" : "°C";
  };

  render() {
    return (
      <AppContext.Provider
        value={{
          darkMode:        this.state.darkMode,
          tempUnit:        this.state.tempUnit,
          isAuthenticated: this.state.isAuthenticated,
          user:            this.state.user,
          setDarkMode:     this.setDarkMode,
          setTempUnit:     this.setTempUnit,
          convertTemp:     this.convertTemp,
          getTempUnit:     this.getTempUnit,
          login:           this.login,
          logout:          this.logout
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    );
  }
}
