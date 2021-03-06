"use strict";

const express = require("express");
const logger = require("./utils/logger");
const pool = require("./utils/db");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const app = express();
app.use(cookieParser());
const exphbs = require("express-handlebars");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(fileUpload());
app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
      prettifyDateTime: function(timestamp) {
        return new Date(timestamp).toTimeString()
      },
      prettifyDate: function(timestamp) {
        return new Date(timestamp).toUTCString()
      },
    },
  })
);
app.set("view engine", ".hbs");

const routes = require("./routes");
app.use("/", routes);

app.get('/api/all/:sensor', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    var query = "SELECT * FROM readings WHERE sensor = '" + req.params.sensor + "'";
    var rows = await conn.query(query);
    res.send(rows);
  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.release();
  }
});

app.get('/api/latest/:sensor', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    var query = "SELECT * FROM readings WHERE sensor = '" + req.params.sensor + "' ORDER BY readingid DESC LIMIT 1";
    var rows = await conn.query(query);
    res.send(rows);
  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.release();
  }
});

app.get('/api/day/:sensor', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    var query = "SELECT * FROM readings WHERE sensor = '" + req.params.sensor + "' AND timestamp >= CURDATE() ORDER BY readingid ASC";
    var rows = await conn.query(query);
    res.send(rows);
  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.release();
  }
});

app.get('/api/day/:sensor/high/temp', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    var query = "SELECT * FROM readings WHERE sensor = '" + req.params.sensor + "' AND timestamp >= CURDATE() ORDER BY reading DESC LIMIT 1";
    var rows = await conn.query(query);
    res.send(rows);
  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.release();
  }
});

app.get('/api/day/:sensor/low/temp', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    var query = "SELECT * FROM readings WHERE sensor = '" + req.params.sensor + "' AND timestamp >= CURDATE() ORDER BY reading ASC LIMIT 1";
    var rows = await conn.query(query);
    res.send(rows);
  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.release();
  }
});

app.get('/api/alerts/:sensor', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    var query = "SELECT * FROM readings WHERE sensor = '" + req.params.sensor + "' AND (reading >= 30) OR (reading <= 10) ORDER BY readingid DESC LIMIT 3";
    var rows = await conn.query(query);
    res.send(rows);
  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.release();
  }
});

const listener = app.listen(process.env.PORT || 4000, function() {
  logger.info(`CREM web app started on port ${listener.address().port}`);
});