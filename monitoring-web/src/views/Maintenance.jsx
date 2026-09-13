import React, { Component } from "react";
import axios from "axios";

const API = "http://localhost:3001";

function StatusBadge({ status }) {
  const s = (status || "").toLowerCase();
  const map = { completed: "badge-completed", "in progress": "badge-in-progress", scheduled: "badge-scheduled" };
  const dot = { completed: "#10b981", "in progress": "#f59e0b", scheduled: "#3b82f6" };
  return (
    <span className={`solaris-badge ${map[s] || "badge-info"}`}>
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", display: "inline-block", background: dot[s] || "#94a3b8" }} />
      {status}
    </span>
  );
}

class Maintenance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      loading: true,
      filterStatus: "All",
      showModal: false,
      form: { installation_name: "", task_type: "", technician: "", scheduled_date: "", status: "Scheduled", notes: "" },
      submitting: false,
      submitError: null,
      submitSuccess: false
    };
  }

  componentDidMount() {
    this.fetchTasks();
  }

  fetchTasks() {
    axios.get(`${API}/api/maintenance`)
      .then(res => this.setState({ tasks: res.data || [], loading: false }))
      .catch(() => this.setState({ loading: false }));
  }

  handleFormChange = (field, value) => {
    this.setState(prev => ({ form: { ...prev.form, [field]: value } }));
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ submitting: true, submitError: null });
    const { form } = this.state;
    axios.post(`${API}/api/maintenance`, { ...form, installation_id: 1 })
      .then(() => {
        this.setState({
          submitting: false, showModal: false, submitSuccess: true,
          form: { installation_name: "", task_type: "", technician: "", scheduled_date: "", status: "Scheduled", notes: "" }
        });
        this.fetchTasks();
        setTimeout(() => this.setState({ submitSuccess: false }), 3000);
      })
      .catch(err => this.setState({ submitting: false, submitError: "Failed to create task. Check connection." }));
  };

  isOverdue(dateStr) {
    return new Date(dateStr) < new Date() && true;
  }

  daysUntil(dateStr) {
    const diff = new Date(dateStr) - new Date();
    const days = Math.ceil(diff / 86400000);
    if (days < 0) return `${Math.abs(days)}d overdue`;
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `In ${days} days`;
  }

  render() {
    const { tasks, loading, filterStatus, showModal, form, submitting, submitError, submitSuccess } = this.state;
    const statuses = ["All", "Scheduled", "In Progress", "Completed"];

    const filtered = filterStatus === "All" ? tasks : tasks.filter(t => t.status === filterStatus);
    const scheduled   = tasks.filter(t => t.status === "Scheduled").length;
    const inProgress  = tasks.filter(t => t.status === "In Progress").length;
    const completed   = tasks.filter(t => t.status === "Completed").length;

    return (
      <div className="content">
        <div className="solaris-page-header">
          <div>
            <h2 className="solaris-section-title">Maintenance</h2>
            <p className="solaris-section-subtitle">
              {scheduled} scheduled · {inProgress} in progress · {completed} completed
            </p>
          </div>
          <button className="solaris-btn-primary" onClick={() => this.setState({ showModal: true })}>
            <i className="fa fa-plus" /> Schedule Task
          </button>
        </div>

        {submitSuccess && (
          <div style={{
            background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: "8px",
            padding: "12px 16px", marginBottom: "20px", color: "#065f46",
            fontSize: "13.5px", display: "flex", alignItems: "center", gap: "8px"
          }}>
            <i className="fa fa-check-circle" /> Maintenance task created successfully.
          </div>
        )}

        {/* Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Total Tasks",  value: tasks.length,  icon: "fa fa-list",       color: "#0284c7", bg: "#e0f2fe" },
            { label: "Scheduled",    value: scheduled,     icon: "fa fa-calendar",   color: "#3b82f6", bg: "#eff6ff" },
            { label: "In Progress",  value: inProgress,    icon: "fa fa-spinner",    color: "#f59e0b", bg: "#fffbeb" },
            { label: "Completed",    value: completed,     icon: "fa fa-check-circle",color: "#10b981",bg: "#ecfdf5" }
          ].map((s, i) => (
            <div key={i} style={{
              background: "white", border: "1px solid var(--solaris-border)",
              borderRadius: "10px", padding: "16px 20px",
              display: "flex", alignItems: "center", gap: "14px",
              boxShadow: "var(--solaris-shadow-sm)"
            }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: s.bg, color: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>
                <i className={s.icon} />
              </div>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--solaris-text-muted)" }}>{s.label}</div>
                <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--solaris-text-primary)", lineHeight: 1.1 }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Task table */}
        <div className="solaris-chart-card">
          <div className="solaris-chart-header">
            <div>
              <p className="solaris-card-title">Maintenance Schedule</p>
              <p className="solaris-card-subtitle">{filtered.length} tasks</p>
            </div>
            <div className="solaris-btn-group">
              {statuses.map(s => (
                <button key={s}
                  className={`solaris-btn-tab${filterStatus === s ? " active" : ""}`}
                  onClick={() => this.setState({ filterStatus: s })}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "48px", color: "var(--solaris-text-muted)" }}>
              <i className="fa fa-spinner fa-spin" style={{ fontSize: "24px", display: "block", marginBottom: "12px" }} />Loading…
            </div>
          ) : (
            <>
              {/* Timeline-style view for Scheduled + In Progress */}
              {filtered.filter(t => t.status !== "Completed").map(task => (
                <div key={task.id} style={{
                  padding: "18px 24px", borderBottom: "1px solid var(--solaris-border)",
                  display: "flex", gap: "16px", alignItems: "flex-start"
                }}>
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "10px", flexShrink: 0,
                    background: task.status === "In Progress" ? "#fffbeb" : "#eff6ff",
                    border: `1px solid ${task.status === "In Progress" ? "#fde68a" : "#bfdbfe"}`,
                    color: task.status === "In Progress" ? "#d97706" : "#3b82f6",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px"
                  }}>
                    <i className={`fa ${task.status === "In Progress" ? "fa-spinner fa-spin" : "fa-calendar"}`} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "4px", flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, fontSize: "14.5px", color: "var(--solaris-text-primary)" }}>{task.task_type}</span>
                      <StatusBadge status={task.status} />
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--solaris-text-muted)", marginBottom: "6px" }}>
                      <i className="pe-7s-map-marker" style={{ marginRight: "4px" }} />{task.installation_name}
                    </div>
                    {task.notes && (
                      <p style={{ fontSize: "12.5px", color: "var(--solaris-text-secondary)", margin: "0 0 6px 0", lineHeight: 1.5 }}>{task.notes}</p>
                    )}
                    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "12px", color: "var(--solaris-text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                        <i className="fa fa-user" /> {task.technician}
                      </span>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: task.scheduled_date < new Date().toISOString().slice(0, 10) && task.status === "Scheduled" ? "#ef4444" : "var(--solaris-text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                        <i className="fa fa-calendar" /> {task.scheduled_date} · {this.daysUntil(task.scheduled_date)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Completed tasks in compact table */}
              {filtered.filter(t => t.status === "Completed").length > 0 && (
                <div>
                  <div style={{ padding: "12px 24px", background: "#f8fafc", borderTop: "1px solid var(--solaris-border)", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--solaris-text-muted)" }}>
                    Completed Tasks
                  </div>
                  <div className="solaris-table-wrapper">
                    <table className="solaris-table">
                      <thead>
                        <tr><th>Task</th><th>Installation</th><th>Technician</th><th>Date</th><th>Status</th></tr>
                      </thead>
                      <tbody>
                        {filtered.filter(t => t.status === "Completed").map(task => (
                          <tr key={task.id}>
                            <td style={{ fontWeight: 600 }}>{task.task_type}</td>
                            <td style={{ color: "var(--solaris-text-secondary)" }}>{task.installation_name}</td>
                            <td>{task.technician}</td>
                            <td style={{ color: "var(--solaris-text-muted)" }}>{task.scheduled_date}</td>
                            <td><StatusBadge status={task.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {filtered.length === 0 && (
                <div className="solaris-empty-state">
                  <i className="fa fa-calendar-o" />
                  <p>No maintenance tasks match your filter</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Create Task Modal */}
        {showModal && (
          <div className="solaris-modal-backdrop" onClick={() => this.setState({ showModal: false })}>
            <div className="solaris-modal-box" onClick={e => e.stopPropagation()}>
              <div className="solaris-modal-header">
                <span style={{ fontSize: "17px", fontWeight: 700, color: "var(--solaris-text-primary)" }}>
                  <i className="fa fa-plus" style={{ marginRight: "8px", color: "#f59e0b" }} />
                  Schedule Maintenance Task
                </span>
                <button
                  style={{ background: "none", border: "none", fontSize: "20px", color: "var(--solaris-text-muted)", cursor: "pointer", padding: "2px 6px" }}
                  onClick={() => this.setState({ showModal: false })}>
                  ×
                </button>
              </div>
              <form onSubmit={this.handleSubmit}>
                <div className="solaris-modal-body">
                  {submitError && (
                    <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "6px", padding: "10px 14px", marginBottom: "16px", color: "#dc2626", fontSize: "13px" }}>
                      <i className="fa fa-exclamation-triangle" style={{ marginRight: "6px" }} />{submitError}
                    </div>
                  )}
                  <div className="solaris-form-group">
                    <label className="solaris-form-label">Installation Name *</label>
                    <input required className="solaris-form-control" value={form.installation_name} onChange={e => this.handleFormChange("installation_name", e.target.value)} placeholder="e.g. Casablanca Green Tech Park Array" />
                  </div>
                  <div className="solaris-form-group">
                    <label className="solaris-form-label">Task Type *</label>
                    <input required className="solaris-form-control" value={form.task_type} onChange={e => this.handleFormChange("task_type", e.target.value)} placeholder="e.g. Thermal Infrared Inspection" />
                  </div>
                  <div className="solaris-form-group">
                    <label className="solaris-form-label">Assigned Technician *</label>
                    <input required className="solaris-form-control" value={form.technician} onChange={e => this.handleFormChange("technician", e.target.value)} placeholder="Full name" />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div className="solaris-form-group">
                      <label className="solaris-form-label">Scheduled Date *</label>
                      <input required type="date" className="solaris-form-control" value={form.scheduled_date} onChange={e => this.handleFormChange("scheduled_date", e.target.value)} />
                    </div>
                    <div className="solaris-form-group">
                      <label className="solaris-form-label">Status</label>
                      <select className="solaris-form-control" value={form.status} onChange={e => this.handleFormChange("status", e.target.value)}>
                        <option>Scheduled</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                      </select>
                    </div>
                  </div>
                  <div className="solaris-form-group">
                    <label className="solaris-form-label">Notes</label>
                    <textarea className="solaris-form-control" rows="3" value={form.notes} onChange={e => this.handleFormChange("notes", e.target.value)} placeholder="Optional notes or instructions…" style={{ resize: "vertical" }} />
                  </div>
                </div>
                <div className="solaris-modal-footer">
                  <button type="button" className="solaris-btn-outline" onClick={() => this.setState({ showModal: false })}>Cancel</button>
                  <button type="submit" className="solaris-btn-primary" disabled={submitting}>
                    {submitting ? <><i className="fa fa-spinner fa-spin" style={{ marginRight: "6px" }} />Saving…</> : <><i className="fa fa-check" style={{ marginRight: "6px" }} />Create Task</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Maintenance;
