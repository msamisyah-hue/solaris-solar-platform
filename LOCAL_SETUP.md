# Local Setup Guide

## Solar Panels Efficiency Monitoring System

This document provides exact, step-by-step instructions for running the complete full-stack application on your local Windows machine.

---

## 1. System Requirements

- **Operating System:** Windows 10/11
- **Node.js:** v16+ (tested and working on **v24.21.0**)
- **npm:** v8+ (tested with **v11.19.0**)
- **Database Server:** MySQL 5.7+ or MariaDB 10.4+ (such as **XAMPP MySQL** on port `3306`)
- **Web Browser:** Google Chrome, Microsoft Edge, or Firefox

---

## 2. Project Architecture & Ports

| Component | Directory | Port / URL | Description |
| :--- | :--- | :--- | :--- |
| **MySQL Database** | Local service (`XAMPP`) | `localhost:3306` | Stores `controller_info` & `surface_info` in `solar_power_test` |
| **Backend API** | `node_local_test_api_server/` | `http://localhost:3001` | Express REST API server |
| **Frontend Web** | `monitoring-web/` | `http://localhost:3000` | React Dashboard & Historical Database GUI |

---

## 3. Database Setup

### Step 3.1: Start MySQL Service
Ensure your MySQL service is running (e.g. start MySQL in the XAMPP Control Panel). Default host is `localhost` on port `3306`.

### Step 3.2: Import Schema and Seed Data
Run the following command from the repository root:

```powershell
cmd.exe /c "c:\xampp\mysql\bin\mysql.exe -u root < database\solar_monitoring.sql"
```

*(If your MySQL is installed elsewhere, replace `c:\xampp\mysql\bin\mysql.exe` with your `mysql.exe` path).*

### Step 3.3: Verify Tables and Seed Data
```powershell
cmd.exe /c "c:\xampp\mysql\bin\mysql.exe -u root -e \"USE solar_power_test; SHOW TABLES; SELECT count(*) FROM controller_info; SELECT count(*) FROM surface_info;\""
```
Both tables should show records covering the last 30 days.

---

## 4. Backend Setup & Run

### Step 4.1: Navigate to Backend Directory
```powershell
cd node_local_test_api_server
```

### Step 4.2: Configuration (`.env`)
The file `node_local_test_api_server/.env` is already configured:
```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=solar_power_test
```

### Step 4.3: Install Dependencies
```powershell
npm.cmd install
```

### Step 4.4: Start the Backend Server
```powershell
npm.cmd start
```
*Output:*
```text
MySQL connected successfully to database: solar_power_test
start!! express server on port 3001
```

### Step 4.5: Verify Backend Health
In another terminal:
```powershell
curl.exe http://localhost:3001/api/health
```
*Expected response:*
```json
{"status":"ok","database":"connected","port":"3001"}
```

---

## 5. Frontend Setup & Run

### Step 5.1: Navigate to Frontend Directory
```powershell
cd monitoring-web
```

### Step 5.2: Install Dependencies
Because of legacy React 16 peer dependencies, always install using `--legacy-peer-deps`:
```powershell
npm.cmd install --legacy-peer-deps
```

### Step 5.3: Start the Frontend Application
```powershell
npm.cmd start
```
*Note:* The start script automatically configures `cross-env NODE_OPTIONS=--openssl-legacy-provider react-scripts start`.

Once started, open your browser at:
- **Dashboard:** [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard)
- **Database History:** [http://localhost:3000/admin/database](http://localhost:3000/admin/database)

---

## 6. End-to-End Application Flow

1. **Live Dummy & Sensor Stream:**  
   Every 10 seconds, `node_local_test_api_server` polls sensor feeds and generates new dummy metrics (voltage, current, temperature, battery state) and inserts them into MySQL.
2. **Real-time Dashboard:**  
   The React frontend polls `http://localhost:3001/controller_info_last` and `/solar_info_last` to update:
   - Solar cell surface temperature graph
   - Controller output gauges (power in Watts, voltage, current)
   - Real-time battery status and charge speed
   - Expected power calculations
3. **Historical Database Monitoring:**  
   On `/admin/database`, selecting time intervals (`L1H`, `L3H`, `L6H`, `L12H`, `LD`, `LW`, `LM`) queries MySQL for historical records and graphs the timeline.

---

## 7. Troubleshooting & Diagnostics

| Issue | Cause | Resolution |
| :--- | :--- | :--- |
| `npm.ps1 cannot be loaded because running scripts is disabled` | Windows PowerShell ExecutionPolicy blocks `.ps1` wrappers. | Run commands using `npm.cmd` directly (e.g. `npm.cmd install`, `npm.cmd start`) or run via `cmd.exe /c npm ...`. |
| `SyntaxError: Identifier 'insert_interval' has already been declared` | Duplicate `const insert_interval` declaration in original `app.js` (lines 36 & 73). | Renamed second interval to `insert_interval_solar` in `app.js`. |
| `ERR_OSSL_EVP_UNSUPPORTED` on `react-scripts start` | Node 17+ uses OpenSSL 3.0 which deprecates MD4 hash used by Webpack 4. | Enabled `NODE_OPTIONS=--openssl-legacy-provider` via `cross-env` in `monitoring-web/package.json`. |
| Native compilation failure with `node-sass` on Node 24 | Deprecated `node-sass 4.12.0` native C++ bindings cannot build on modern Node. | Switched `src/index.js` to import the pre-compiled `src/assets/css/light-bootstrap-dashboard-react.css` stylesheet and removed `node-sass` dependency. |
| OpenWeatherMap returns HTTP 401 Unauthorized | Original student project API key is deactivated. | Added graceful demo weather fallback in `Dashboard.jsx` and `Database.jsx` so weather cards, sunrise/sunset, and power estimations render properly offline. |
| Crash on empty database `get_count()` | `rows[0].entry_id` threw TypeError when `controller_info` had no records. | Added empty table guard `count = (rows && rows.length > 0) ? rows[0].entry_id + 1 : 1;` and seeded 30 days of initial data. |
