import React, { Component } from "react";
import { AppContext } from "../AppContext";

class Login extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      showPassword: false,
      error: "",
      loading: false,
      emailTouched: false,
      passwordTouched: false
    };
  }

  componentDidMount() {
    // If already authenticated, redirect to dashboard
    if (this.context.isAuthenticated) {
      this.props.history.replace("/admin/dashboard");
    }
    // Remove dark class on login page for clean presentation
    document.body.classList.remove("alromar-dark");
  }

  componentDidUpdate() {
    if (this.context.isAuthenticated) {
      this.props.history.replace("/admin/dashboard");
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = this.state;

    if (!email || !password) {
      this.setState({ error: "Veuillez remplir tous les champs.", emailTouched: true, passwordTouched: true });
      return;
    }

    this.setState({ loading: true, error: "" });

    // Simulate a short async delay for realism
    setTimeout(() => {
      const result = this.context.login(email, password);
      if (result.success) {
        this.props.history.replace("/admin/dashboard");
      } else {
        this.setState({ loading: false, error: result.message, password: "" });
      }
    }, 600);
  };

  render() {
    const { email, password, showPassword, error, loading, emailTouched, passwordTouched } = this.state;
    const emailError    = emailTouched && !email;
    const passwordError = passwordTouched && !password;

    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f1f1a 0%, #176B5B 50%, #0f2d24 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        padding: "20px"
      }}>
        {/* Background decorative elements */}
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          overflow: "hidden", pointerEvents: "none", zIndex: 0
        }}>
          {/* Sun rays */}
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              top: "-10%", left: "50%",
              width: "2px",
              height: "60%",
              background: "linear-gradient(to bottom, rgba(244,185,66,0.15), transparent)",
              transformOrigin: "top center",
              transform: `translateX(-50%) rotate(${i * 45}deg)`,
            }} />
          ))}
          {/* Circle glow */}
          <div style={{
            position: "absolute", top: "15%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: "300px", height: "300px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(244,185,66,0.08) 0%, transparent 70%)"
          }} />
        </div>

        {/* Login card */}
        <div style={{
          position: "relative", zIndex: 1,
          background: "rgba(255,255,255,0.97)",
          borderRadius: "20px",
          padding: "48px 44px",
          width: "100%",
          maxWidth: "440px",
          boxShadow: "0 25px 50px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.1)",
          backdropFilter: "blur(20px)"
        }}>
          {/* Logo + branding */}
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "16px",
              background: "linear-gradient(135deg, #F4B942 0%, #176B5B 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 8px 20px rgba(23,107,91,0.3)"
            }}>
              {/* Sun SVG */}
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            <h1 style={{
              fontSize: "22px", fontWeight: 800, letterSpacing: "2px",
              textTransform: "uppercase", color: "#1F2937", margin: "0 0 4px"
            }}>
              ALROMAR ENERGIES
            </h1>
            <p style={{
              fontSize: "12.5px", color: "#6B7280", margin: 0,
              letterSpacing: "0.3px"
            }}>
              Plateforme de supervision photovoltaïque
            </p>
          </div>

          {/* Title */}
          <div style={{ marginBottom: "28px" }}>
            <h2 style={{
              fontSize: "18px", fontWeight: 700, color: "#1F2937",
              margin: "0 0 4px"
            }}>
              Connexion
            </h2>
            <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>
              Accédez à votre tableau de bord
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: "10px", padding: "12px 16px",
              marginBottom: "20px", display: "flex", alignItems: "flex-start", gap: "10px"
            }}>
              <i className="fa fa-exclamation-circle" style={{ color: "#dc2626", fontSize: "16px", marginTop: "1px", flexShrink: 0 }} />
              <span style={{ fontSize: "13.5px", color: "#991b1b", lineHeight: 1.4 }}>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={this.handleSubmit} noValidate>
            {/* Email field */}
            <div style={{ marginBottom: "18px" }}>
              <label style={{
                display: "block", fontSize: "13px", fontWeight: 600,
                color: "#374151", marginBottom: "7px"
              }}>
                Adresse e-mail
              </label>
              <div style={{ position: "relative" }}>
                <i className="fa fa-envelope" style={{
                  position: "absolute", left: "14px", top: "50%",
                  transform: "translateY(-50%)", color: "#9CA3AF", fontSize: "14px"
                }} />
                <input
                  type="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={e => this.setState({ email: e.target.value, error: "" })}
                  onBlur={() => this.setState({ emailTouched: true })}
                  placeholder="admin@alromar-energies.ma"
                  style={{
                    width: "100%", padding: "11px 14px 11px 40px",
                    borderRadius: "10px", fontSize: "14px",
                    border: emailError ? "1.5px solid #ef4444" : "1.5px solid #D1D5DB",
                    outline: "none", color: "#1F2937",
                    background: emailError ? "#fef2f2" : "#F9FAFB",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                    boxSizing: "border-box"
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = "#176B5B";
                    e.target.style.boxShadow = "0 0 0 3px rgba(23,107,91,0.12)";
                    e.target.style.background = "#fff";
                  }}
                  onBlurCapture={e => {
                    e.target.style.borderColor = emailError ? "#ef4444" : "#D1D5DB";
                    e.target.style.boxShadow = "none";
                    e.target.style.background = emailError ? "#fef2f2" : "#F9FAFB";
                  }}
                />
              </div>
              {emailError && (
                <p style={{ fontSize: "12px", color: "#dc2626", margin: "5px 0 0 2px" }}>
                  Veuillez saisir votre adresse e-mail.
                </p>
              )}
            </div>

            {/* Password field */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "block", fontSize: "13px", fontWeight: 600,
                color: "#374151", marginBottom: "7px"
              }}>
                Mot de passe
              </label>
              <div style={{ position: "relative" }}>
                <i className="fa fa-lock" style={{
                  position: "absolute", left: "14px", top: "50%",
                  transform: "translateY(-50%)", color: "#9CA3AF", fontSize: "14px"
                }} />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => this.setState({ password: e.target.value, error: "" })}
                  onBlur={() => this.setState({ passwordTouched: true })}
                  placeholder="••••••••••"
                  style={{
                    width: "100%", padding: "11px 44px 11px 40px",
                    borderRadius: "10px", fontSize: "14px",
                    border: passwordError ? "1.5px solid #ef4444" : "1.5px solid #D1D5DB",
                    outline: "none", color: "#1F2937",
                    background: passwordError ? "#fef2f2" : "#F9FAFB",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                    boxSizing: "border-box"
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = "#176B5B";
                    e.target.style.boxShadow = "0 0 0 3px rgba(23,107,91,0.12)";
                    e.target.style.background = "#fff";
                  }}
                  onBlurCapture={e => {
                    e.target.style.borderColor = passwordError ? "#ef4444" : "#D1D5DB";
                    e.target.style.boxShadow = "none";
                    e.target.style.background = passwordError ? "#fef2f2" : "#F9FAFB";
                  }}
                />
                {/* Show/hide password toggle */}
                <button
                  type="button"
                  onClick={() => this.setState({ showPassword: !showPassword })}
                  style={{
                    position: "absolute", right: "12px", top: "50%",
                    transform: "translateY(-50%)", background: "none",
                    border: "none", cursor: "pointer", color: "#9CA3AF",
                    fontSize: "14px", padding: "4px",
                    display: "flex", alignItems: "center"
                  }}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  <i className={`fa fa-eye${showPassword ? "-slash" : ""}`} />
                </button>
              </div>
              {passwordError && (
                <p style={{ fontSize: "12px", color: "#dc2626", margin: "5px 0 0 2px" }}>
                  Veuillez saisir votre mot de passe.
                </p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: "10px",
                border: "none",
                background: loading
                  ? "#9CA3AF"
                  : "linear-gradient(135deg, #176B5B 0%, #38A169 100%)",
                color: "white",
                fontSize: "15px",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                boxShadow: loading ? "none" : "0 4px 14px rgba(23,107,91,0.3)",
                transition: "all 0.2s",
                letterSpacing: "0.3px"
              }}
            >
              {loading ? (
                <>
                  <i className="fa fa-spinner fa-spin" />
                  Connexion en cours…
                </>
              ) : (
                <>
                  <i className="fa fa-sign-in" />
                  Se connecter
                </>
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div style={{
            marginTop: "28px",
            padding: "14px 16px",
            background: "#f0fdf4",
            border: "1px solid #86efac",
            borderRadius: "10px"
          }}>
            <p style={{ fontSize: "12px", fontWeight: 700, color: "#166534", margin: "0 0 6px" }}>
              <i className="fa fa-info-circle" style={{ marginRight: "6px" }} />
              Identifiants de démonstration
            </p>
            <div style={{ fontSize: "12.5px", color: "#166534", lineHeight: 1.7 }}>
              <div>
                <strong>E-mail :</strong>{" "}
                <span
                  style={{ cursor: "pointer", textDecoration: "underline dotted" }}
                  onClick={() => this.setState({ email: "admin@alromar-energies.ma" })}
                >
                  admin@alromar-energies.ma
                </span>
              </div>
              <div>
                <strong>Mot de passe :</strong>{" "}
                <span
                  style={{ cursor: "pointer", textDecoration: "underline dotted" }}
                  onClick={() => this.setState({ password: "Alromar2025" })}
                >
                  Alromar2025
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p style={{
            textAlign: "center", fontSize: "11.5px", color: "#9CA3AF",
            margin: "24px 0 0", lineHeight: 1.5
          }}>
            Prototype de démonstration · Données simulées
          </p>
        </div>
      </div>
    );
  }
}

export default Login;
