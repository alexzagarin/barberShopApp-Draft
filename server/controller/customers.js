const express = require("express");
const router = express.Router();

const loginCustomerABL = require("../abl/customers/loginCustomerABL");
const createCustomerABL = require("../abl/customers/createCustomerABL");
const getCustomerABL = require("../abl/customers/getCustomerABL");
const updateCustomerABL = require("../abl/customers/updateCustomerABL");
const deleteCustomerABL = require("../abl/customers/deleteCustomerABL");

router.post("/login", loginCustomerABL);
router.post("/", createCustomerABL);
router.get("/:id", getCustomerABL);  // Example of using authentication middleware
router.put("/:id", updateCustomerABL);
router.delete("/:id", deleteCustomerABL);

module.exports = router;
