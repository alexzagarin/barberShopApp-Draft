const reservationsDao = require("../../dao/reservationsDao");

async function checkServiceAvailability(serviceId, dateTime) {
    const reservations = await reservationsDao.list({
        serviceId: serviceId,
        reservationDate: dateTime,
        status: "Booked" // Only consider active reservations
    });

    return reservations.length === 0;
}

module.exports = checkServiceAvailability;
