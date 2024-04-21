const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv({ allErrors: true });
addFormats(ajv); // To validate date-time formats properly

const reservationsDao = require("../../dao/reservationsDao");
const checkServiceAvailability = require("../services/checkAvailabilityABL");
const { isFutureDate, isWithinBusinessHours } = require('../../helpers/dateTimeHelper');

// Define the schema for reservation validation
const reservationSchema = {
  type: "object",
  properties: {
    customerId: { type: "string", pattern: "^[0-9a-fA-F]{32}$" },
    serviceId: { type: "string", pattern: "^[0-9a-fA-F]{24}$" },
    reservationDate: { type: "string", format: "date-time" },
    status: { type: "string", enum: ["Booked", "Completed", "Cancelled"] }
  },
  required: ["customerId", "serviceId", "reservationDate", "status"],
  additionalProperties: false
};

async function createReservation(req, res) {
  const reservationDetails = req.body;

  // Validate the reservation details against the schema
  const valid = ajv.validate(reservationSchema, reservationDetails);
  if (!valid) {
    return res.status(400).json({
      message: "Validation failed",
      errors: ajv.errors
    });
  }

  // Check if the reservation date is in the future and within business hours
  if (!isFutureDate(reservationDetails.reservationDate)) {
    return res.status(400).json({ message: "Reservation date must be in the future." });
  }

  if (!isWithinBusinessHours(reservationDetails.reservationDate)) {
    return res.status(400).json({ message: "Reservation must be within business hours (9 AM to 5 PM)." });
  }

  // Check if the service is available at the given date and time
  const isAvailable = await checkServiceAvailability(reservationDetails.serviceId, reservationDetails.reservationDate);
  if (!isAvailable) {
    return res.status(409).json({ message: "Service not available at the selected time." });
  }

  // If all checks pass, create the reservation
  try {
    const newReservation = await reservationsDao.create(reservationDetails);
    return res.status(201).json(newReservation);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = createReservation;
