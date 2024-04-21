const express = require("express");
const router = express.Router();

const createServiceABL = require("../abl/services/createServiceABL");
const getServiceABL = require("../abl/services/getServiceABL");
const listServicesABL = require("../abl/services/listServicesABL");
const updateServiceABL = require("../abl/services/updateServiceABL");
const deleteServiceABL = require("../abl/services/deleteServiceABL");

router.post("/", createServiceABL);
router.get("/:id", getServiceABL);
router.get("/", listServicesABL);  // This will make this route respond to '/api/services'
router.put("/:id", updateServiceABL);
router.delete("/:id", deleteServiceABL);
console.log("Accessing list services endpoint");
module.exports = router;
