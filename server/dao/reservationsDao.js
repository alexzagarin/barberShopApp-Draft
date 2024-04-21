const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const reservationsFolderPath = path.join(__dirname, 'storage', 'ReservationList');

// Helper function to generate a unique ID for each reservation
function generateUniqueId() {
  return crypto.randomBytes(16).toString('hex');
}

// Create a new reservation
function create(reservation) {
  const id = generateUniqueId();
  reservation.id = id;
  const reservationPath = path.join(reservationsFolderPath, `${id}.json`);
  fs.writeFileSync(reservationPath, JSON.stringify(reservation), 'utf8');
  return reservation;
}

// Find a reservation by ID
function findById(id) {
  try {
    const reservationPath = path.join(reservationsFolderPath, `${id}.json`);
    const reservationData = fs.readFileSync(reservationPath, 'utf8');
    return JSON.parse(reservationData);
  } catch (error) {
    throw new Error(`Failed to read reservation: ${error.message}`);
  }
}

// Update a reservation by ID
function update(id, data) {
  try {
    const reservationPath = path.join(reservationsFolderPath, `${id}.json`);
    if (fs.existsSync(reservationPath)) {
      const reservationData = JSON.parse(fs.readFileSync(reservationPath, 'utf8'));
      const updatedReservation = { ...reservationData, ...data };
      fs.writeFileSync(reservationPath, JSON.stringify(updatedReservation), 'utf8');
      return updatedReservation;
    }
    return null;
  } catch (error) {
    throw new Error(`Failed to update reservation: ${error.message}`);
  }
}

// Remove a reservation by ID
function remove(id) {
  try {
    const reservationPath = path.join(reservationsFolderPath, `${id}.json`);
    fs.unlinkSync(reservationPath);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false;  // No file to delete
    }
    throw new Error(`Failed to remove reservation: ${error.message}`);
  }
}

// List all reservations, with optional filtering
function list(filter = {}) {
  try {
    const files = fs.readdirSync(reservationsFolderPath);
    const reservations = files.map(file => {
      const reservationData = fs.readFileSync(path.join(reservationsFolderPath, file), 'utf8');
      return JSON.parse(reservationData);
    });

    // Apply filters, if any
    if (Object.keys(filter).length) {
      return reservations.filter(reservation => {
        return Object.entries(filter).every(([key, value]) => reservation[key] === value);
      });
    }

    return reservations;
  } catch (error) {
    throw new Error(`Failed to list reservations: ${error.message}`);
  }
}

module.exports = { create, findById, update, remove, list };
