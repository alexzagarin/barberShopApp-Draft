const servicesDao = require("../../dao/servicesDao");

async function getService(req, res) {
  const { id } = req.params;
  try {
    const service = await servicesDao.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    return res.json(service);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = getService;
