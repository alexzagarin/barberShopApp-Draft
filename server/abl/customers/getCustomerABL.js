const customersDao = require("../../dao/customersDao");

async function getCustomer(req, res) {
  const { id } = req.params;
  try {
    const customer = await customersDao.findById(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    return res.json(customer);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = getCustomer;
