const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const customersDao = require("../../dao/customersDao");

const updateCustomerSchema = {
  type: "object",
  properties: {
    firstName: { type: "string", minLength: 2, optional: true },
    lastName: { type: "string", minLength: 2, optional: true },
    email: { type: "string", format: "email", optional: true },
    phoneNumber: { type: "string", minLength: 10, optional: true }
  },
  additionalProperties: false
};

async function updateCustomer(req, res) {
  const { id } = req.params;
  const customerData = req.body;
  const valid = ajv.validate(updateCustomerSchema, customerData);
  if (!valid) {
    return res.status(400).json({
      message: "Validation failed",
      errors: ajv.errors
    });
  }

  try {
    const updatedCustomer = await customersDao.update(id, customerData);
    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    return res.json(updatedCustomer);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = updateCustomer;
