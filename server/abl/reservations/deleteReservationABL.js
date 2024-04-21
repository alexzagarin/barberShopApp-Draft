const reservationsDao = require("../../dao/reservationsDao");

async function deleteReservation(req, res) {
  const { id } = req.params;
  try {
    const deleted = await reservationsDao.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    return res.status(204).send(); // No content to return upon successful deletion
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = deleteReservation;
