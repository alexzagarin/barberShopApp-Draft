const reservationsDao = require("../../dao/reservationsDao");

async function listReservations(req, res) {
  try {
    const { status, date } = req.query;
    const filters = {};
    if (status) {
      filters.status = status;
    }
    if (date) {
      filters.reservationDate = date;
    }
    const reservations = await reservationsDao.list(filters);
    return res.json(reservations);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
console.log("Accessing list services endpoint");
module.exports = listReservations;
