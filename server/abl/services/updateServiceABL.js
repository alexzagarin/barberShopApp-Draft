const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const servicesDao = require("../../dao/servicesDao");

const updateServiceSchema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 3, optional: true },
    description: { type: "string", minLength: 5, optional: true },
    price: { type: "number", minimum: 0, optional: true }
  },
  additionalProperties: false
};

async function updateService(req, res) {
  const { id } = req.params;
  const serviceData = req.body;
  const valid = ajv.validate(updateServiceSchema, serviceData);
  if (!valid) {
    return res.status(400).json({
      message: "Validation failed",
      errors: ajv.errors
    });
  }

  try {
    const updatedService = await servicesDao.update(id, serviceData);
    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }
    return res.json(updatedService);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = updateService;
