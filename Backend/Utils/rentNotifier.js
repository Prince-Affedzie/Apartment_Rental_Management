const cron = require('node-cron');
const mongoose = require('mongoose');
const moment = require('moment');
const { sendSMSToList } = require('./SMSConfig'); // Your existing SMS utility
const {Tenants} = require('../Models/Tenants');
const {User} = require('../Models/Users')



// Schedule: Every day at 8 AM
// '0 8 * * *'
cron.schedule('0 8 1 * * *', async () => {
  process.env.TZ = 'UTC'
  console.log(' Running Rent Expiry Check Job...');

  try {
    const today = moment();
   const threeMonthsAhead = moment().add(3, 'months').endOf('day');;

    //  Find tenants whose rent expires in the next 7 days
    const tenants = await Tenants.find({
        expirationDate: {
        $gte: today.toDate(),
        $lte: threeMonthsAhead.toDate()
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
    const admin = await User.findOne({role:'Admin'})
    const managerPhones =  admin.phone; 

    const tenantNames = tenants.map(t => t.tenantName).join(', ');
    const shortMessage = `Reminder: The following tenants' rents are due within the next 3 months: ${tenantNames}.`;

    await sendSMSToList([managerPhones], shortMessage);


    console.log(`SMS reminders sent to ${tenants.length} tenants.`);
  } catch (err) {
    console.error(' Error during rent expiry check:', err.message);
  }
});


/*cron.schedule('0 8 1 * *', async () => {
  console.log('🔔 Running Monthly Rent Expiry Check Job...');

  try {
    const today = moment().startOf('day');
    const threeMonthsAhead = moment().add(3, 'months').endOf('day');

    // Find tenants whose rent expires in the next 3 months
    const tenants = await Tenants.find({
      expirationDate: {
        $gte: today.toDate(),
        $lte: threeMonthsAhead.toDate()
      }
    });

    if (tenants.length === 0) {
      console.log('✅ No rent expirations within the next 3 months.');
      return;
    }

    for (const tenant of tenants) {
      const daysLeft = moment(tenant.expirationDate).diff(today, 'days');
      const message = `Hi ${tenant.tenantName}, your rent expires in ${daysLeft} day(s) on ${moment(tenant.expirationDate).format('Do MMM YYYY')}. Please plan to renew.`;

      await sendSMSToList([tenant.tenantPhone], message);
    }*/
