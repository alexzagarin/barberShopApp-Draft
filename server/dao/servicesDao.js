const fs = require('fs');
const path = require('path');

const servicesFolderPath = path.join(__dirname, 'storage', 'ServiceList');

// Create a service
function create(service) {
  const id = generateUniqueId();
  const servicePath = path.join(servicesFolderPath, `${id}.json`);
  service.id = id;
  fs.writeFileSync(servicePath, JSON.stringify(service), 'utf8');
  return service;
}

// Get a service by ID
function findById(id) {
  try {
    const servicePath = path.join(servicesFolderPath, `${id}.json`);
    const serviceData = fs.readFileSync(servicePath, 'utf8');
    return JSON.parse(serviceData);
  } catch (error) {
    throw { code: 'failedToReadService', message: error.message };
  }
}

// Update a service
function update(id, data) {
  const servicePath = path.join(servicesFolderPath, `${id}.json`);
  if (fs.existsSync(servicePath)) {
    const serviceData = JSON.parse(fs.readFileSync(servicePath, 'utf8'));
    const updatedService = { ...serviceData, ...data };
    fs.writeFileSync(servicePath, JSON.stringify(updatedService), 'utf8');
    return updatedService;
  }
  return null;
}

// Delete a service
function remove(id) {
  try {
    const servicePath = path.join(servicesFolderPath, `${id}.json`);
    fs.unlinkSync(servicePath);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false; // No file to delete
    }
    throw { code: 'failedToRemoveService', message: error.message };
  }
}

// List all services
function list() {
  try {
    const files = fs.readdirSync(servicesFolderPath);
    return files.map(file => {
      const serviceData = fs.readFileSync(path.join(servicesFolderPath, file), 'utf8');
      return JSON.parse(serviceData);
    });
  } catch (error) {
    throw { code: 'failedToListServices', message: error.message };
  }
}

function generateUniqueId() {
  return require('crypto').randomBytes(16).toString('hex');
}

module.exports = { create, findById, update, remove, list };
