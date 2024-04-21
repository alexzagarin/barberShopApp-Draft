const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const customersFolderPath = path.join(__dirname, 'storage', 'CustomerList');

// Create a new customer with hashed password
async function create(customer) {
  const id = generateUniqueId();
  const customerPath = path.join(customersFolderPath, `${id}.json`);
  customer.id = id;
  fs.writeFileSync(customerPath, JSON.stringify(customer), 'utf8');  // Store as is, no hashing
  return customer;
}

function findById(id) {
  try {
    const customerPath = path.join(customersFolderPath, `${id}.json`);
    const customerData = fs.readFileSync(customerPath, 'utf8');
    return JSON.parse(customerData);
  } catch (error) {
    throw { code: 'failedToReadCustomer', message: error.message };
  }
}

function findByEmail(email) {
  const files = fs.readdirSync(customersFolderPath);
  for (const file of files) {
      const filePath = path.join(customersFolderPath, file);
      const customerData = fs.readFileSync(filePath, 'utf8');
      const customer = JSON.parse(customerData);
      if (customer.email.toLowerCase() === email.toLowerCase()) { // Case insensitive comparison
          return customer;
      }
  }
  return null;
}

function update(id, data) {
  const customerPath = path.join(customersFolderPath, `${id}.json`);
  if (fs.existsSync(customerPath)) {
    const customerData = JSON.parse(fs.readFileSync(customerPath, 'utf8'));
    const updatedCustomer = { ...customerData, ...data };
    fs.writeFileSync(customerPath, JSON.stringify(updatedCustomer), 'utf8');
    return updatedCustomer;
  }
  return null;
}

function remove(id) {
  try {
    const customerPath = path.join(customersFolderPath, `${id}.json`);
    fs.unlinkSync(customerPath);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false; // No file to delete
    }
    throw { code: 'failedToRemoveCustomer', message: error.message };
  }
}

function list() {
  try {
    const files = fs.readdirSync(customersFolderPath);
    return files.map(file => {
      const customerData = fs.readFileSync(path.join(customersFolderPath, file), 'utf8');
      return JSON.parse(customerData);
    });
  } catch (error) {
    throw { code: 'failedToListCustomers', message: error.message };
  }
}

function generateUniqueId() {
  return require('crypto').randomBytes(16).toString('hex');
}

module.exports = { create, findById, findByEmail, update, remove, list };
