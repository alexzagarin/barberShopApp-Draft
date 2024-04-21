const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const reservationsDao = require("../../dao/reservationsDao");

const updateReservationSchema = {
  type: "object",
  properties: {
    reservationDate: { type: "string", format: "date-time", optional: true },
    status: { type: "string", enum: ["Booked", "Completed", "Cancelled"], optional: true }
  },
  additionalProperties: false
};

async function updateReservation(req, res) {
  const { id } = req.params;
  const reservationData = req.body;
  const valid = ajv.validate(updateReservationSchema, reservationData);
  if (!valid) {
    return res.status(400).json({
      message: "Validation failed",
      errors: ajv.errors
    });
  }

  try {
    const updatedReservation = await reservationsDao.update(id, reservationData);
    if (!updatedReservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    return res.json(updatedReservation);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = updateReservation;
