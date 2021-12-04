"use strict";

const logger = require("../utils/logger");
const userStore = require("../models/user-store");
const account = require("./account");
const readingutil = require("../utils/readingutil");

const dashboard = {
    index(request, response) {
        const loggedInUser = account.getCurrentUser(request);
        if(loggedInUser) {
            logger.info("Logged in user: " + loggedInUser.email);
            let userSensors = userStore.getUserSensors(loggedInUser.id);
            logger.info(userSensors);
            let latestReadings = [];
            latestReadings.push(readingutil.getLatestReadings(userSensors));
            logger.info("All Latest Readings: " + latestReadings);
            const viewData = {
                title: "CREM | Dashboard",
                loggedInUser: loggedInUser,
                sensors: userSensors,
                latest: latestReadings,
            };
            logger.info("Rendering Dashboard");
            response.render("dashboard", viewData);
        } else {
            response.redirect("/login");
        }
    },
    addSensor(request, response) {
        const loggedInUser = account.getCurrentUser(request);
        const sensor = request.body.sensor;
        userStore.addSensor(loggedInUser, sensor);
        response.redirect("/dashboard");
      },
};

module.exports = dashboard;