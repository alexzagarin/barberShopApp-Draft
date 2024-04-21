const reservationsDao = require("../../dao/reservationsDao");

async function getReservation(req, res) {
  const { id } = req.params;
  try {
    const reservation = await reservationsDao.findById(id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    return res.json(reservation);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = getReservation;
