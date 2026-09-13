require('dotenv').config();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var mysql = require('mysql');
const fetch = require('node-fetch');

const PORT = process.env.PORT || 3001;

var connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'solar_power_test'
});

connection.connect(function(err) {
  if (err) {
    console.error("MySQL connection error:", err.message);
  } else {
    console.log("MySQL connected successfully to database: " + (process.env.DB_NAME || 'solar_power_test'));
  }
});

app.listen(PORT, function() {
  console.log("start!! express server on port " + PORT);
});

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Health check endpoint
app.get('/api/health', function(req, res) {
  connection.query('SELECT 1', function(err) {
    if (err) {
      return res.status(500).json({ status: 'error', database: 'disconnected', error: err.message });
    }
    res.json({ status: 'ok', database: 'connected', port: PORT, system: 'ALROMAR ENERGIES Platform' });
  });
});

function get_random_value() {
  return Math.random();
}

// generate dummy sensor data
const insert_interval_sensor = setInterval(() => {
  fetch('https://api.thingspeak.com/channels/961989/feeds/last.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(surface_info) {
      if (surface_info && surface_info["entry_id"]) {
        let entry_id = surface_info["entry_id"];
        let temperature = surface_info["field3"] ? parseFloat(surface_info["field3"]) : (get_random_value() * 15 + 20);
        let humidity = 0;
        let query_sentence = 'INSERT INTO surface_info VALUES (' + entry_id + ',' + temperature + ',' + humidity + ',CURRENT_TIMESTAMP);';
        connection.query(query_sentence, function (err, rows, fields) {
          if (err) {
            // Silently ignore duplicates
          } else {
            console.log('INSERT SENSOR COMPLETE !!!');
          }
        });
      }
    })
    .catch(function(err) {
      // Offline fallback
    });
}, 10000);

let count = 0;

function get_count() {
  connection.query('SELECT entry_id FROM controller_info ORDER BY entry_id DESC limit 1', function(err, rows, fields) {
    if (err) {
      console.error('Error fetching entry_id count:', err.message);
      return;
    }
    if (rows && rows.length > 0 && rows[0].entry_id !== undefined) {
      count = rows[0].entry_id + 1;
      console.log("Current max entry_id:", rows[0].entry_id);
    } else {
      count = 1;
      console.log("Initial entry_id initialized to 1");
    }
  });
}

get_count();

// generate dummy solar panel data
const insert_interval_solar = setInterval(() => {
  let entry_id = count;
  count = count + 1;
  let temperature = get_random_value() * 15 + 25;
  let humidity = Math.round(get_random_value() * 10 + 40);

  let query_sentence = 'INSERT INTO surface_info VALUES (' + entry_id + ',' + temperature + ',' + humidity + ',CURRENT_TIMESTAMP);';
  connection.query(query_sentence, function (err, rows, fields) {
    if (err) {
      // ignore
    } else {
      console.log('INSERT SURFACE COMPLETE !!!');
    }
  });

  let solar_voltage = get_random_value() * 3 + 2;
  let solar_current = get_random_value() * 2 + 1;
  let battery_voltage = get_random_value() * 4 + 10;
  let battery_current = get_random_value() + 3 + 8;
  let battery_state = "bulk";
  let solar_charged = get_random_value() * 3;
  let yield_kwh = Math.random() * 10 + 350;

  let query_sentence_2 = 'INSERT INTO controller_info VALUES (' + entry_id + ',' + solar_voltage + ',' + solar_current + ',' + battery_voltage + ',' + battery_current + ',"' + battery_state + '",' + solar_charged + ',CURRENT_TIMESTAMP,' + yield_kwh + ');';
  connection.query(query_sentence_2, function (err, rows, fields) {
    if (err) {
      // ignore
    } else {
      console.log('INSERT CONTROLLER COMPLETE !!!');
    }
  });
}, 10000);

// ========================================================
// ORIGINAL API ENDPOINTS (100% Preserved)
// ========================================================

app.get('/controller_info_last', function(req, res) {
  connection.query('SELECT * FROM controller_info ORDER BY entry_id DESC limit 1', function(err, rows, fields) {
    if (err) throw err;
    res.json(rows);
  });
});

app.get('/controller_info_last_L1H', function(req, res) {
  connection.query('SELECT * FROM controller_info WHERE timestamp > DATE_ADD(now(), INTERVAL -1 hour)', function(err, rows, fields) {
    if (err) throw err;
    res.json(rows);
  });
});

app.get('/controller_info_last_L3H', function(req, res) {
  connection.query('SELECT * FROM controller_info WHERE timestamp > DATE_ADD(now(), INTERVAL -3 hour)', function(err, rows, fields) {
    if (err) throw err;
    res.json(rows);
  });
});

app.get('/controller_info_last_L6H', function(req, res) {
  connection.query('SELECT * FROM controller_info WHERE timestamp > DATE_ADD(now(), INTERVAL -6 hour)', function(err, rows, fields) {
    if (err) throw err;
    res.json(rows);
  });
});

app.get('/controller_info_last_L12H', function(req, res) {
  connection.query('SELECT * FROM controller_info WHERE timestamp > DATE_ADD(now(), INTERVAL -12 hour)', function(err, rows, fields) {
    if (err) throw err;
    res.json(rows);
  });
});

app.get('/controller_info_last_LD', function(req, res) {
  connection.query('SELECT * FROM controller_info WHERE timestamp > DATE_ADD(now(), INTERVAL -24 hour)', function(err, rows, fields) {
    if (err) throw err;
    res.json(rows);
  });
});

app.get('/controller_info_last_LW', function(req, res) {
  connection.query('SELECT * FROM controller_info WHERE timestamp > DATE_ADD(now(), INTERVAL -168 hour)', function(err, rows, fields) {
    if (err) throw err;
    res.json(rows);
  });
});

app.get('/controller_info_last_LM', function(req, res) {
  connection.query('SELECT * FROM controller_info WHERE timestamp > DATE_ADD(now(), INTERVAL -7200 hour)', function(err, rows, fields) {
    if (err) throw err;
    res.json(rows);
  });
});

app.get('/solar_info_last', function(req, res) {
  connection.query('SELECT * FROM surface_info ORDER BY timestamp DESC limit 1', function(err, rows, fields) {
    if (err) throw err;
    res.json(rows);
  });
});

app.get('/solar_info_last_L1H', function(req, res) {
  connection.query('SELECT * FROM surface_info WHERE timestamp > DATE_ADD(now(), INTERVAL -1 hour)', function(err, rows, fields) {
    if (err) throw err;
    res.json(rows);
  });
});

app.get('/solar_info_last_L3H', function(req, res) {
  connection.query('SELECT * FROM surface_info WHERE timestamp > DATE_ADD(now(), INTERVAL -3 hour)', function(err, rows, fields) {
    if (err) throw err;
    res.json(rows);
  });
});

app.get('/solar_info_last_L6H', function(req, res) {
  connection.query('SELECT * FROM surface_info WHERE timestamp > DATE_ADD(now(), INTERVAL -6 hour)', function(err, rows, fields) {
    if (err) throw err;
    res.json(rows);
  });
});

app.get('/solar_info_last_L12H', function(req, res) {
  connection.query('SELECT * FROM surface_info WHERE timestamp > DATE_ADD(now(), INTERVAL -12 hour)', function(err, rows, fields) {
    if (err) throw err;
    res.json(rows);
  });
});

app.get('/solar_info_last_LD', function(req, res) {
  connection.query('SELECT * FROM surface_info WHERE timestamp > DATE_ADD(now(), INTERVAL -24 hour)', function(err, rows, fields) {
    if (err) throw err;
    res.json(rows);
  });
});

app.get('/solar_info_last_LW', function(req, res) {
  connection.query('SELECT * FROM surface_info WHERE timestamp > DATE_ADD(now(), INTERVAL -168 hour)', function(err, rows, fields) {
    if (err) throw err;
    res.json(rows);
  });
});

app.get('/solar_info_last_LM', function(req, res) {
  connection.query('SELECT * FROM surface_info WHERE timestamp > DATE_ADD(now(), INTERVAL -7200 hour)', function(err, rows, fields) {
    if (err) throw err;
    res.json(rows);
  });
});

// ========================================================
// SOLARIS ENTERPRISE REST API ENDPOINTS
// ========================================================

// Portfolio System Statistics
app.get('/api/system_stats', function(req, res) {
  const sql = `
    SELECT 
      (SELECT COUNT(*) FROM installations) AS total_installations,
      (SELECT COUNT(*) FROM installations WHERE status = 'Operational') AS active_installations,
      (SELECT COALESCE(SUM(capacity_kw), 0) FROM installations) AS total_capacity_kw,
      (SELECT COALESCE(SUM(panels_count), 0) FROM installations) AS total_panels,
      (SELECT COALESCE(SUM(current_power_kw), 0) FROM installations) AS total_current_power_kw,
      (SELECT COALESCE(SUM(daily_yield_kwh), 0) FROM installations) AS total_daily_yield_kwh,
      (SELECT COALESCE(AVG(efficiency), 0) FROM installations) AS avg_efficiency,
      (SELECT COUNT(*) FROM system_alerts WHERE status = 'active') AS active_alerts,
      (SELECT COUNT(*) FROM maintenance_tasks WHERE status = 'Scheduled') AS upcoming_maintenance
  `;
  connection.query(sql, function(err, rows) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const stats = rows[0] || {};
    // Calculate estimated carbon offset (0.7 kg CO2 per kWh)
    const co2OffsetKg = stats.total_daily_yield_kwh * 0.7;
    const treesEquivalent = Math.round(co2OffsetKg / 21.7); // ~21.7 kg CO2 absorbed per tree per year
    res.json({
      ...stats,
      co2_offset_tonnes: (co2OffsetKg / 1000).toFixed(2),
      trees_equivalent: treesEquivalent
    });
  });
});

// Installations List
app.get('/api/installations', function(req, res) {
  connection.query('SELECT * FROM installations ORDER BY id ASC', function(err, rows) {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Single Installation Details with Panels & Alerts
app.get('/api/installations/:id', function(req, res) {
  const instId = parseInt(req.params.id, 10);
  connection.query('SELECT * FROM installations WHERE id = ?', [instId], function(err, instRows) {
    if (err) return res.status(500).json({ error: err.message });
    if (!instRows || instRows.length === 0) {
      return res.status(404).json({ error: 'Installation not found' });
    }
    const installation = instRows[0];
    connection.query('SELECT * FROM solar_panels WHERE installation_id = ?', [instId], function(err, panelRows) {
      if (err) panelRows = [];
      connection.query('SELECT * FROM system_alerts WHERE installation_id = ? ORDER BY created_at DESC', [instId], function(err, alertRows) {
        if (err) alertRows = [];
        connection.query('SELECT * FROM maintenance_tasks WHERE installation_id = ? ORDER BY scheduled_date DESC', [instId], function(err, maintRows) {
          if (err) maintRows = [];
          res.json({
            ...installation,
            panels: panelRows,
            alerts: alertRows,
            maintenance: maintRows
          });
        });
      });
    });
  });
});

// Solar Panels Asset List
app.get('/api/panels', function(req, res) {
  const sql = `
    SELECT p.*, i.name AS installation_name, i.location AS installation_location
    FROM solar_panels p
    LEFT JOIN installations i ON p.installation_id = i.id
    ORDER BY p.id ASC
  `;
  connection.query(sql, function(err, rows) {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// System Alerts
app.get('/api/alerts', function(req, res) {
  connection.query('SELECT * FROM system_alerts ORDER BY created_at DESC', function(err, rows) {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Acknowledge Alert
app.post('/api/alerts/:id/acknowledge', function(req, res) {
  const alertId = parseInt(req.params.id, 10);
  connection.query('UPDATE system_alerts SET status = "acknowledged" WHERE id = ?', [alertId], function(err, result) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: 'Alert acknowledged', id: alertId });
  });
});

// Maintenance Tasks
app.get('/api/maintenance', function(req, res) {
  connection.query('SELECT * FROM maintenance_tasks ORDER BY scheduled_date ASC', function(err, rows) {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Create Maintenance Task
app.post('/api/maintenance', function(req, res) {
  const { installation_id, installation_name, task_type, technician, scheduled_date, status, notes } = req.body;
  const sql = `
    INSERT INTO maintenance_tasks (installation_id, installation_name, task_type, technician, scheduled_date, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  connection.query(sql, [installation_id || 1, installation_name || 'Site Array', task_type, technician, scheduled_date, status || 'Scheduled', notes || ''], function(err, result) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: result.insertId, message: 'Maintenance task created' });
  });
});