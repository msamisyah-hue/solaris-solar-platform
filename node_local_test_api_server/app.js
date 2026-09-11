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
    res.json({ status: 'ok', database: 'connected', port: PORT });
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
            console.log('Sensor insert error:', err.message);
          } else {
            console.log('INSERT SENSOR COMPLETE !!!');
          }
        });
      }
    })
    .catch(function(err) {
      console.log('ThingSpeak fetch error (using fallback):', err.message);
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
      console.log('Surface insert error:', err.message);
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
      console.log('Controller insert error:', err.message);
    } else {
      console.log('INSERT CONTROLLER COMPLETE !!!');
    }
  });
}, 10000);

// API for Front-end

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