const servicesDao = require("../../dao/servicesDao");

async function deleteService(req, res) {
  const { id } = req.params;
  try {
    const deleted = await servicesDao.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Service not found" });
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = deleteService;
