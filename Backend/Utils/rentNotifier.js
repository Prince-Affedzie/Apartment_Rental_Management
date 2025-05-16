// ./Utils/rentNotifier.js
const cron = require('node-cron');
const moment = require('moment');
const { sendSMSToList } = require('./SMSConfig');
const { Tenants } = require('../Models/Tenants');
const { User } = require('../Models/Users');

function startRentNotifier() {
  // Run on the **1st of every month at 8 AM (UTC)**
  cron.schedule('0 8 1 * *', async () => {
    process.env.TZ = 'UTC'; // Ensure runs in UTC
    console.log('📅 Running Rent Expiry Check Job...');

    try {
      const today = moment();
      const threeMonthsAhead = moment().add(3, 'months').endOf('day');

      const tenants = await Tenants.find({
        expirationDate: {
          $gte: today.toDate(),
          $lte: threeMonthsAhead.toDate()
        }
      });

      if (tenants.length === 0) {
        console.log('✅ No upcoming rent expirations.');
        return;
      }

      for (const tenant of tenants) {
        const daysLeft = moment(tenant.expirationDate).diff(today, 'days');
        const message = `Hi ${tenant.tenantName}, your rent expires in ${daysLeft} day(s) on ${moment(tenant.expirationDate).format('Do MMM YYYY')}. Please renew soon.`;

        await sendSMSToList([tenant.tenantPhone], message);
      }

      const admin = await User.findOne({ role: 'Admin' });
      const tenantNames = tenants.map(t => t.tenantName).join(', ');
      const shortMessage = `Reminder: These tenants' rents expire within 3 months: ${tenantNames}`;

      if (admin?.phone) {
        await sendSMSToList([admin.phone], shortMessage);
      }

      console.log(`SMS reminders sent to ${tenants.length} tenants.`);
    } catch (err) {
      console.error(' Error during rent notifier cron:', err.message);
    }
  });

  console.log('🛎️ Rent notifier cron job initialized.');
}

module.exports = startRentNotifier;