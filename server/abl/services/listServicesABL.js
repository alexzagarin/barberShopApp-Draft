const servicesDao = require("../../dao/servicesDao");

async function listServices(req, res) {
  try {
    const services = await servicesDao.list({});
    return res.json(services);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = listServices;