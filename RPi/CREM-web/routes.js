"use strict";

const express = require("express");
const router = express.Router();

const home = require("./controllers/home.js");
const account = require("./controllers/account.js");
const dashboard = require("./controllers/dashboard.js");
const sensor = require("./controllers/sensor.js");

router.get("/", home.index);
router.get("/account", account.index);
router.get("/login", account.login);
router.get("/logout", account.logout);
router.get("/register", account.register);
router.get("/dashboard", dashboard.index);
router.get('/dashboard/deletesensor/:id', dashboard.deleteSensor);
router.get("/sensor/:name", sensor.index);

router.post("/registration", account.registration);
router.post("/authentication", account.authentication);
router.post("/dashboard/addsensor", dashboard.addSensor);
router.post("/updateaccount/:userid", account.update);

module.exports = router;