const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const customersDao = require("../../dao/customersDao");

const customerSchema = {
  type: "object",
  properties: {
    firstName: { type: "string", minLength: 2 },
    lastName: { type: "string", minLength: 2 },
    email: { type: "string", format: "email" },
    phoneNumber: { type: "string", minLength: 10 },
    password: { type: "string", minLength: 5 }
  },
  required: ["firstName", "lastName", "email", "phoneNumber", "password"],
  additionalProperties: false
};

async function createCustomer(req, res) {
  const customerData = req.body;
  const valid = ajv.validate(customerSchema, customerData);
  if (!valid) {
      return res.status(400).json({
          message: "Validation failed",
          errors: ajv.errors
      });
  }

  const existingCustomer = await customersDao.findByEmail(customerData.email);
  if (existingCustomer) {
      return res.status(409).json({ message: "Email already in use." });
  }

  try {
      // Temporarily store password as plain text
      const newCustomer = await customersDao.create(customerData);  // Assume password is already in plain text
      return res.status(201).json({
          message: "Customer created successfully",
          id: newCustomer.id
      });
  } catch (error) {
      return res.status(500).json({ message: error.message });
  }
}

module.exports = createCustomer;
