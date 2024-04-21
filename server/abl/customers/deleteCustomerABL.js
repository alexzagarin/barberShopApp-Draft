const customersDao = require("../../dao/customersDao");

async function deleteCustomer(req, res) {
  const { id } = req.params;
  try {
    const deleted = await customersDao.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Customer not found" });
    }
    return res.status(204).send(); // No content to return upon successful deletion
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = deleteCustomer;
