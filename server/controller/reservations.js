const express = require("express");
const router = express.Router();
const { authenticate } = require('../helpers/authHelper');

const createReservationABL = require("../abl/reservations/createReservationABL");
const getReservationABL = require("../abl/reservations/getReservationABL");
const listReservationsABL = require("../abl/reservations/listReservationsABL");
const updateReservationABL = require("../abl/reservations/updateReservationABL");
const deleteReservationABL = require("../abl/reservations/deleteReservationABL");

// Apply the authentication middleware to routes that require a logged-in user
router.post("/", authenticate, createReservationABL);
router.get("/:id", authenticate, getReservationABL);
router.get("/", listReservationsABL);
router.put("/:id", updateReservationABL);
router.delete("/:id", authenticate, deleteReservationABL);

module.exports = router;
