# SOLARIS — Local Setup Guide
## Solar Energy Management & Monitoring Platform

---

## Prerequisites

- **Node.js** v14+ (with npm)
- **MySQL** 5.7+ or MariaDB 10+
- A terminal / command prompt

---

## 1. Database Setup

Open MySQL and run the full schema script:

```sql
source database/solar_monitoring.sql
```

Or import via MySQL Workbench / phpMyAdmin.

This creates the `solar_power_test` database with:
- `controller_info` — live solar telemetry
- `surface_info` — panel temperature readings
- `installations` — 6 Moroccan demo installations
- `solar_panels` — 14 panel assets
- `system_alerts` — demo operational alerts
- `maintenance_tasks` — demo maintenance schedule

---

## 2. Backend API Server

```bash
cd node_local_test_api_server
npm install
npm start
```

Server starts on **http://localhost:3001**

Verify it's working:
```
http://localhost:3001/api/health
```

Expected response:
```json
{ "status": "ok", "database": "connected", "system": "SOLARIS Energy Platform" }
```

---

## 3. Frontend (React)

```bash
cd monitoring-web
npm install
npm start
```

App opens on **http://localhost:3000**

---

## 4. Navigation

| Page | URL |
|---|---|
| Dashboard | http://localhost:3000/admin/dashboard |
| Energy Monitoring | http://localhost:3000/admin/energy |
| Analytics | http://localhost:3000/admin/analytics |
| Installations | http://localhost:3000/admin/installations |
| Solar Panels | http://localhost:3000/admin/panels |
| Alerts | http://localhost:3000/admin/alerts |
| Maintenance | http://localhost:3000/admin/maintenance |
| Reports | http://localhost:3000/admin/reports |
| Settings | http://localhost:3000/admin/settings |

---

## 5. Notes

- **No IoT hardware required.** The backend simulates sensor data every 10 seconds automatically.
- **Demo data** is pre-seeded: 6 Moroccan solar installations, 14 panels, alerts, maintenance records.
- All data is **local** — no external services required except an optional OpenWeatherMap API call (fails gracefully with demo fallback).
- Original open-source attribution preserved in `LICENSE.md`.

---

## Attribution

Built on top of [Light Bootstrap Dashboard React](https://github.com/creativetimofficial/light-bootstrap-dashboard-react) v1.3.0 by Creative Tim (MIT License).  
SOLARIS interface, enterprise features, and extended functionality are original work for this engineering internship project.
