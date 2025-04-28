const cron = require('node-cron');
const mongoose = require('mongoose');
const moment = require('moment');
const { sendSMSToList } = require('./SMSConfig'); // Your existing SMS utility
const {Tenants} = require('../Models/Tenants');

// Schedule: Every day at 8 AM
// '0 8 * * *'
cron.schedule('0 8 * * *', async () => {
  console.log(' Running Rent Expiry Check Job...');

  try {
    const today = moment();
    const nextWeek = moment().add(7, 'days').endOf('day');

    //  Find tenants whose rent expires in the next 7 days
    const tenants = await Tenants.find({
        expirationDate: {
        $gte: today.toDate(),
        $lte: nextWeek.toDate()
      }
    });

    if (tenants.length === 0) {
      console.log('No upcoming rent expirations.');
      return;
    }

    // Loop through tenants and send SMS one by one
    for (const tenant of tenants) {
      const daysLeft = moment(tenant.expirationDate).diff(today, 'days');
      const message = `Hi ${tenant.tenantName}, your rent expires in ${daysLeft} day(s) on ${moment(tenant.expirationDate).format('Do MMM YYYY')}. Please renew soon.`;

      await sendSMSToList([tenant.tenantPhone], message); 
    }

    console.log(`SMS reminders sent to ${tenants.length} tenants.`);
  } catch (err) {
    console.error(' Error during rent expiry check:', err.message);
  }
});
