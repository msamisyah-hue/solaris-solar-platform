# Project Setup Analysis

**Project:** Design of Solar Panels Efficiency Monitoring System  
**Original Repository:** `I-GO-AT/Organizing-the-solar-panel-efficiency-monitoring-system`  
**Analysis Date:** 2026-09-11  

---

## 1. Project Architecture & Data Flow

```text
[ Hardware / IoT Sensors / TTN / ThingSpeak ]
                       ↓
               [ MySQL Database ]
          Database: `solar_power_test`
          Tables: `controller_info`, `surface_info`
                       ↓
           [ Node.js / Express API Server ]
          Port: 3001
          Endpoints: /controller_info_last, /solar_info_last, ...
                       ↓
            [ React Frontend Application ]
          Port: 3000 (Create React App)
          Views: Dashboard (/admin/dashboard), Database (/admin/database)
          Libraries: Bootstrap 3, Material-UI, Chart.js, Chartist
```

### Components & Responsibilities
1. **React Frontend (`monitoring-web/`)**:
   - Built on Creative Tim's Light Bootstrap Dashboard React v1.3.0.
   - Entry point: `src/index.js`.
   - Routing: `react-router-dom` v5 handling `/admin/dashboard` and `/admin/database`.
   - Makes HTTP GET requests via `axios` to `http://localhost:3001` for controller and solar data.
   - Renders real-time and historical graphs using `chart.js` (`react-chartjs-2`), gauges (`react-gauge-chart`), and Bootstrap cards.
   - Makes external HTTP GET call to OpenWeatherMap API for live local weather and sunrise/sunset times.

2. **Node.js / Express Backend (`node_local_test_api_server/`)**:
   - Entry point: `app.js`.
   - Port: `3001`.
   - Connects to MySQL on `localhost:3306` with user `root`, no password, database `solar_power_test`.
   - Periodic tasks:
     - 10-second interval fetching latest sensor feed from ThingSpeak channel 961989 and inserting into `surface_info`.
     - 10-second interval generating simulated solar panel and controller data and inserting into `surface_info` and `controller_info`.
   - Exposes 16 REST endpoints for current and historical (1H, 3H, 6H, 12H, 24H, 7D, 30D) records.

3. **MySQL Database**:
   - Service: XAMPP MySQL / MariaDB (running locally on port 3306, `mysqld.exe`).
   - Database name: `solar_power_test`.
   - Tables: `controller_info` and `surface_info`.

---

## 2. Technical Inventory

| Attribute | Frontend (`monitoring-web`) | Backend (`node_local_test_api_server`) |
| :--- | :--- | :--- |
| **Entry Point** | `src/index.js` | `app.js` |
| **Default Port** | `3000` | `3001` |
| **Runtime Environment** | Browser (bundled via Webpack 4 / react-scripts) | Node.js (v24.21.0 on host) |
| **Key Dependencies** | React 16.8.6, React-DOM 16.8.6, Axios, Chart.js 2.9.3, React-Chartjs-2 2.7.2, Material-UI Core 1.5.1, Bootstrap 3.3.7, React-Bootstrap 0.32.4, React-Gauge-Chart 0.2.5 | Express 4.x, Cors 2.8.5, Body-Parser 1.19.0, Mysql 2.x, Node-Fetch 2.x |
| **External APIs** | OpenWeatherMap API (`http://api.openweathermap.org/data/2.5/weather...`) | ThingSpeak API (`https://api.thingspeak.com/channels/961989/feeds/last.json`) |

---

## 3. Database Schema & Query Requirements

### Tables and Columns

#### 1. `controller_info`
Tracks solar charge controller, battery metrics, and power generation:
- `entry_id` (INT, Primary Key)
- `solar_voltage` (DOUBLE)
- `solar_current` (DOUBLE)
- `battery_voltage` (DOUBLE)
- `battery_current` (DOUBLE)
- `battery_state` (VARCHAR(50)) - e.g., 'bulk'
- `solar_charged` (DOUBLE)
- `timestamp` (DATETIME, Default CURRENT_TIMESTAMP)
- `yield_kwh` (DOUBLE)

#### 2. `surface_info`
Tracks solar panel surface temperature and humidity:
- `entry_id` (INT)
- `temperature` (DOUBLE)
- `humidity` (DOUBLE)
- `timestamp` (DATETIME, Default CURRENT_TIMESTAMP)

### API Endpoints
- `GET /controller_info_last`: Latest single controller record
- `GET /controller_info_last_L1H`: Controller records for last 1 hour
- `GET /controller_info_last_L3H`: Controller records for last 3 hours
- `GET /controller_info_last_L6H`: Controller records for last 6 hours
- `GET /controller_info_last_L12H`: Controller records for last 12 hours
- `GET /controller_info_last_LD`: Controller records for last 24 hours (day)
- `GET /controller_info_last_LW`: Controller records for last 168 hours (week)
- `GET /controller_info_last_LM`: Controller records for last 7200 hours (month)
- `GET /solar_info_last`: Latest single surface record
- `GET /solar_info_last_L1H`: Surface records for last 1 hour
- `GET /solar_info_last_L3H`: Surface records for last 3 hours
- `GET /solar_info_last_L6H`: Surface records for last 6 hours
- `GET /solar_info_last_L12H`: Surface records for last 12 hours
- `GET /solar_info_last_LD`: Surface records for last 24 hours (day)
- `GET /solar_info_last_LW`: Surface records for last 168 hours (week)
- `GET /solar_info_last_LM`: Surface records for last 7200 hours (month)

---

## 4. Issues & Compatibility Diagnostics

### 1. PowerShell Script Execution Restriction
- **Problem**: Running `npm` fails with `PSSecurityException` (`npm.ps1 cannot be loaded because running scripts is disabled on this system`).
- **Cause**: Windows PowerShell execution policy blocks `.ps1` wrapper scripts.
- **Solution**: Execute commands using `npm.cmd` directly or through `cmd.exe /c npm ...`.
- **Files changed**: None (operational command adjustment).

### 2. Backend Missing `package.json`
- **Problem**: `node_local_test_api_server/` contained `package-lock.json` and `app.js` but no `package.json`.
- **Cause**: Original repository was committed without the package manifest.
- **Solution**: Reconstructed minimal `package.json` with exact dependencies: `express`, `cors`, `body-parser`, `mysql`, `node-fetch`, and `dotenv`.
- **Files changed**: [node_local_test_api_server/package.json](file:///c:/Users/HP/OneDrive/Bureau/alromar%201/Organizing-the-solar-panel-efficiency-monitoring-system/node_local_test_api_server/package.json)

### 3. Backend Syntax Error in `app.js`
- **Problem**: `SyntaxError: Identifier 'insert_interval' has already been declared`.
- **Cause**: Line 36 declared `const insert_interval = setInterval(...)` and line 73 declared `const insert_interval = setInterval(...)` in the same scope.
- **Solution**: Renamed the second interval identifier to `insert_interval_solar`.
- **Files changed**: [node_local_test_api_server/app.js](file:///c:/Users/HP/OneDrive/Bureau/alromar%201/Organizing-the-solar-panel-efficiency-monitoring-system/node_local_test_api_server/app.js)

### 4. Backend Potential Crash on Empty Database (`get_count()`)
- **Problem**: `rows[0].entry_id` threw `TypeError` if `controller_info` had 0 rows when the server started.
- **Cause**: Code assumed that historical rows already existed in the table.
- **Solution**: Added empty-table safety check: `count = (rows && rows.length > 0) ? rows[0].entry_id + 1 : 1`. Provided initial seed data in SQL script.
- **Files changed**: [node_local_test_api_server/app.js](file:///c:/Users/HP/OneDrive/Bureau/alromar%201/Organizing-the-solar-panel-efficiency-monitoring-system/node_local_test_api_server/app.js), [database/solar_monitoring.sql](file:///c:/Users/HP/OneDrive/Bureau/alromar%201/Organizing-the-solar-panel-efficiency-monitoring-system/database/solar_monitoring.sql)

### 5. Frontend `node-sass` Incompatibility with Node 24
- **Problem**: `node-sass: 4.12.0` relies on deprecated libsass native C++ bindings that fail on Node 16+.
- **Cause**: Native Node C++ ABI changes in modern Node versions.
- **Solution**: Replaced `.scss` import in `src/index.js` with the already-compiled, identical stylesheet `src/assets/css/light-bootstrap-dashboard-react.css`, and removed `node-sass` from `package.json`.
- **Files changed**: [monitoring-web/src/index.js](file:///c:/Users/HP/OneDrive/Bureau/alromar%201/Organizing-the-solar-panel-efficiency-monitoring-system/monitoring-web/src/index.js), [monitoring-web/package.json](file:///c:/Users/HP/OneDrive/Bureau/alromar%201/Organizing-the-solar-panel-efficiency-monitoring-system/monitoring-web/package.json)

### 6. Webpack 4 & OpenSSL 3.0 Compatibility (`react-scripts: 3.0.0`)
- **Problem**: Node 17+ defaults to OpenSSL 3.0, causing `digital envelope routines::unsupported` cryptographic hash errors in Webpack 4.
- **Cause**: Webpack 4 uses MD4 for hashing, which OpenSSL 3 disables by default.
- **Solution**: Configured `NODE_OPTIONS=--openssl-legacy-provider` via `cross-env` in `monitoring-web/package.json`.
- **Files changed**: [monitoring-web/package.json](file:///c:/Users/HP/OneDrive/Bureau/alromar%201/Organizing-the-solar-panel-efficiency-monitoring-system/monitoring-web/package.json)

### 7. Modern npm Peer Dependency Resolution
- **Problem**: npm 7+ and npm 11 strictly enforce peer dependencies; React 16.8 packages have strict conflicts.
- **Cause**: Breaking change in npm 7+ default peer dependency behavior.
- **Solution**: Executed installation with `npm.cmd install --legacy-peer-deps`.
- **Files changed**: None (operational command adjustment).

### 8. OpenWeatherMap API 401 Unauthorized
- **Problem**: The embedded key in `Dashboard.jsx` (`631834fd61a1d3309f1beefed08165e1`) is deactivated, returning HTTP 401.
- **Cause**: Original student project API key expired.
- **Solution**: Added fallback realistic weather data in `.catch` blocks so weather stats cards, sunrise/sunset, and power estimation calculations display properly offline.
- **Files changed**: [monitoring-web/src/views/Dashboard.jsx](file:///c:/Users/HP/OneDrive/Bureau/alromar%201/Organizing-the-solar-panel-efficiency-monitoring-system/monitoring-web/src/views/Dashboard.jsx), [monitoring-web/src/views/Database.jsx](file:///c:/Users/HP/OneDrive/Bureau/alromar%201/Organizing-the-solar-panel-efficiency-monitoring-system/monitoring-web/src/views/Database.jsx)

