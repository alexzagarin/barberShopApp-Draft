const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const servicesDao = require("../../dao/servicesDao");

const serviceSchema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 3 },
    description: { type: "string", minLength: 5 },
    price: { type: "number", minimum: 0 }
  },
  required: ["name", "description", "price"],
  additionalProperties: false
};

async function createService(req, res) {
  const serviceData = req.body;
  const valid = ajv.validate(serviceSchema, serviceData);
  if (!valid) {
    return res.status(400).json({
      message: "Validation failed",
      errors: ajv.errors
    });
  }

  try {
    const newService = await servicesDao.create(serviceData);
    return res.status(201).json(newService);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = createService;
