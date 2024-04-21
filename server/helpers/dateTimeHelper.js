const moment = require('moment');

const isFutureDate = (dateString) => {
    const reservationDateTime = moment(dateString);
    return reservationDateTime.isAfter(moment());
};

const isWithinBusinessHours = (dateString) => {
    const reservationDateTime = moment(dateString);
    return reservationDateTime.hour() >= 9 && reservationDateTime.hour() <= 17;
};

module.exports = { isFutureDate, isWithinBusinessHours };
